'use strict'

// Turns every merged-case court document from a link into a copy.
//
// Until now a document brought in from a case merged into another was the
// merged case's own row doing double duty: case_id / court_session_id /
// document_order placed it in the merged case, merged_court_session_id and
// merged_document_order placed it in the parent case's session. It is now a
// new row owned by the parent case, with merged_from_case_id naming where it
// came from, so it lives the parent's ordinary document lifecycle.
//
// The two orders already share the parent session's sequence, so
// merged_document_order maps straight onto the copy's document_order. The copy
// keeps the original's created timestamp: after a court session is deleted all
// unfiled documents lose their order, and created is the only thing left that
// keeps each merged case's documents together and in sequence when the next
// session files them again.
//
// The copy shares the original's case file - the document is the same
// document, laid before the parent's court - so nothing is duplicated in S3.
//
// Idempotent: the source predicate only matches rows that still carry the
// merged fields, and up() clears those fields once the copies exist.
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
        INSERT INTO court_document (
          id, created, modified, case_id, court_session_id, document_type,
          document_order, name, case_file_id, generated_pdf_uri, submitted_by,
          merged_from_case_id
        )
        SELECT
          gen_random_uuid(), cd.created, NOW(), cs.case_id,
          cd.merged_court_session_id, cd.document_type,
          cd.merged_document_order, cd.name, cd.case_file_id,
          cd.generated_pdf_uri, cd.submitted_by, cd.case_id
        FROM court_document AS cd
        JOIN court_session AS cs ON cs.id = cd.merged_court_session_id
        WHERE cd.merged_court_session_id IS NOT NULL
          AND cd.merged_document_order IS NOT NULL
          AND cd.merged_from_case_id IS NULL
        `,
        { transaction },
      )

      // Clear exactly what was copied. Both merged columns are nullable, so a
      // row could in principle carry a session link with no order - nothing
      // writes that state and there are none, but clearing such a row would
      // drop a merge with no copy to show for it. Leave it linked instead, so
      // it is still there to be found.
      await queryInterface.sequelize.query(
        `
        UPDATE court_document
        SET merged_court_session_id = NULL,
            merged_document_order = NULL,
            modified = NOW()
        WHERE merged_court_session_id IS NOT NULL
          AND merged_document_order IS NOT NULL
          AND merged_from_case_id IS NULL
        `,
        { transaction },
      )

      // The two orders shared the parent's sequence but were not always
      // distinct within it: the reuse model assigned every merged document
      // `nextOrder + document_order - 1`, so documents that shared an order in
      // the merged case - the subpoenas of several defendants, filed together
      // - all landed on the same order in the parent while the parent's own
      // later documents were still shifted by the full count. One sequence
      // with ties and gaps, which the reuse machinery tolerated and the
      // ordinary document machinery does not: it reads a session's first and
      // last order as the bounds of a move.
      //
      // So renumber each affected case's filed documents densely, in the order
      // they already stood. Court sessions run oldest first and each continues
      // where the previous ended, which is the sequence the application
      // maintains. Blocks stay together because a block's documents are
      // already adjacent. Idempotent - a dense sequence renumbers to itself.
      await queryInterface.sequelize.query(
        `
        WITH renumbered AS (
          SELECT cd.id,
                 row_number() OVER (
                   PARTITION BY cd.case_id
                   ORDER BY cs.created, cd.document_order, cd.created
                 ) AS new_order
          FROM court_document AS cd
          JOIN court_session AS cs ON cs.id = cd.court_session_id
          WHERE cd.document_order > 0
            AND cd.case_id IN (
              SELECT DISTINCT case_id
              FROM court_document
              WHERE merged_from_case_id IS NOT NULL
            )
        )
        UPDATE court_document AS cd
        SET document_order = renumbered.new_order,
            modified = NOW()
        FROM renumbered
        WHERE cd.id = renumbered.id
          AND cd.document_order <> renumbered.new_order
        `,
        { transaction },
      )
    })
  },

  // Puts the links back on the originals from what the copies carry, then
  // removes the copies. The original is the document of the merged case the
  // copy was made from, matched on what identifies the same document: the
  // backing case file, or the generated PDF, and only by name when the copy
  // has neither. Name is the weakest of the three because the court may rename
  // a copy - an externally filed document with no file behind it and a changed
  // name therefore loses its link, which is as far back as the copies can
  // carry it.
  //
  // The restored merged_document_order values come from the renumbered
  // sequence, so a case that had ties comes back without them. That is the
  // sequence the reuse machinery would have produced had it not shared an
  // order between documents, and the reuse code reads it the same way.
  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
        UPDATE court_document AS original
        SET merged_court_session_id = copy.court_session_id,
            merged_document_order = copy.document_order,
            modified = NOW()
        FROM court_document AS copy
        WHERE copy.merged_from_case_id IS NOT NULL
          AND copy.court_session_id IS NOT NULL
          AND original.case_id = copy.merged_from_case_id
          AND original.merged_from_case_id IS NULL
          AND CASE
                WHEN copy.case_file_id IS NOT NULL
                  THEN original.case_file_id = copy.case_file_id
                WHEN copy.generated_pdf_uri IS NOT NULL
                  THEN original.generated_pdf_uri = copy.generated_pdf_uri
                ELSE original.name = copy.name
                  AND original.case_file_id IS NULL
                  AND original.generated_pdf_uri IS NULL
              END
        `,
        { transaction },
      )

      await queryInterface.sequelize.query(
        `DELETE FROM court_document WHERE merged_from_case_id IS NOT NULL`,
        { transaction },
      )
    })
  },
}

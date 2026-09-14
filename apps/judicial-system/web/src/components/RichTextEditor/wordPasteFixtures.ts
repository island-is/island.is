// Structurally faithful excerpts of what desktop Word puts on the clipboard:
// fake lists as styled paragraphs (mso-list:l<id> level<n>), the visible
// marker in an mso-list:Ignore span with a 7pt spacer span nested inside it,
// wrapped in conditional comments, plus namespaced o:p elements. The
// surrounding <html>/<head> boilerplate is included where it matters
// (style blocks must not leak into content).

export const FLAT_BULLET_LIST = `
<html><head><style>p.MsoListParagraph {margin-left:36.0pt;}</style></head><body>
<p class=MsoListParagraph style='text-indent:-18.0pt;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><!--[endif]-->Fyrsti punktur<o:p></o:p></p>
<p class=MsoListParagraph style='text-indent:-18.0pt;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='font-family:Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><!--[endif]-->Annar punktur<o:p></o:p></p>
</body></html>`

export const NUMBERED_LIST = `
<p class=MsoListParagraph style='text-indent:-18.0pt;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='mso-list:Ignore'>1.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp; </span></span><!--[endif]-->Fyrsta atriði</p>
<p class=MsoListParagraph style='text-indent:-18.0pt;mso-list:l0 level1 lfo1'><!--[if !supportLists]--><span style='mso-list:Ignore'>2.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp; </span></span><!--[endif]-->Annað atriði</p>`

export const LETTERED_LIST = `
<p class=MsoListParagraph style='text-indent:-18.0pt;mso-list:l0 level1 lfo1'><span style='mso-list:Ignore'>a.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp; </span></span>Fyrsta</p>
<p class=MsoListParagraph style='text-indent:-18.0pt;mso-list:l0 level1 lfo1'><span style='mso-list:Ignore'>b.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp; </span></span>Annað</p>`

export const ROMAN_LIST = `
<p class=MsoListParagraph style='text-indent:-18.0pt;mso-list:l0 level1 lfo1'><span style='mso-list:Ignore'>i.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span>Fyrsta</p>
<p class=MsoListParagraph style='text-indent:-18.0pt;mso-list:l0 level1 lfo1'><span style='mso-list:Ignore'>ii.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span>Annað</p>`

// Bullet at level 1, its sub-bullet at level 2 (Word marks level 2 with the
// "o" Courier New bullet), then back out to level 1.
export const NESTED_LIST = `
<p class=MsoListParagraphCxSpFirst style='text-indent:-18.0pt;mso-list:l0 level1 lfo1'><span style='font-family:Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp; </span></span></span>Efst</p>
<p class=MsoListParagraphCxSpMiddle style='margin-left:72.0pt;text-indent:-18.0pt;mso-list:l0 level2 lfo1'><span style='font-family:"Courier New"'><span style='mso-list:Ignore'>o<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp; </span></span></span>Undirliður</p>
<p class=MsoListParagraphCxSpLast style='text-indent:-18.0pt;mso-list:l0 level1 lfo1'><span style='font-family:Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp; </span></span></span>Aftur efst</p>`

// A level-1 item followed directly by a level-3 item — the levels in between
// have no items of their own.
export const SKIPPED_LEVEL_LIST = `
<p class=MsoListParagraph style='text-indent:-18.0pt;mso-list:l0 level1 lfo1'><span style='font-family:Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp; </span></span></span>Efst</p>
<p class=MsoListParagraph style='margin-left:108.0pt;text-indent:-9.0pt;mso-list:l0 level3 lfo1'><span style='font-family:Wingdings'><span style='mso-list:Ignore'>§<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp; </span></span></span>Djúpt</p>`

// Two lists with different list ids (Word numbers them l0, l1 with separate
// lfo counters) — they must not merge into one.
export const TWO_ADJACENT_LISTS = `
<p class=MsoListParagraph style='text-indent:-18.0pt;mso-list:l0 level1 lfo1'><span style='mso-list:Ignore'>1.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp; </span></span>Fyrri listi</p>
<p class=MsoListParagraph style='text-indent:-18.0pt;mso-list:l1 level1 lfo2'><span style='mso-list:Ignore'>1.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp; </span></span>Seinni listi</p>`

export const LIST_SPLIT_BY_PARAGRAPH = `
<p class=MsoListParagraph style='text-indent:-18.0pt;mso-list:l0 level1 lfo1'><span style='mso-list:Ignore'>1.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp; </span></span>Fyrir</p>
<p class=MsoNormal>Millitexti</p>
<p class=MsoListParagraph style='text-indent:-18.0pt;mso-list:l0 level1 lfo1'><span style='mso-list:Ignore'>2.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp; </span></span>Eftir</p>`

// Highlighted and bold text inside an item: the highlight arrives as the
// Word "background" shorthand, bold as a b element.
export const FORMATTED_LIST_ITEM = `
<p class=MsoListParagraph style='text-indent:-18.0pt;mso-list:l0 level1 lfo1'><span style='mso-list:Ignore'>1.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp; </span></span><span style='background:yellow;mso-highlight:yellow'>merkt</span> og <b>feitletrað</b></p>`

// Word "Merge formatting" / Word Online without mso-list styles: the
// paragraph keeps its list class and the marker is literal leading text.
export const MERGE_FORMATTING_LIST = `
<p class=MsoListParagraph style='margin-left:36.0pt'>1. Fyrsta atriði</p>
<p class=MsoListParagraph style='margin-left:36.0pt'>2. Annað atriði</p>`

// The downlevel-revealed conditional form (no comment dashes) Word also
// emits; the HTML parser turns these into bogus comments.
export const DOWNLEVEL_CONDITIONAL_LIST = `
<p class=MsoListParagraph style='text-indent:-18.0pt;mso-list:l0 level1 lfo1'><![if !supportLists]><span style='mso-list:Ignore'>1.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp; </span></span><![endif]>Atriði</p>`

export const REAL_LIST_PASSTHROUGH = `<ul><li>Fyrsti</li><li>Annar</li></ul>`

export const INDENTED_PARAGRAPH = `<p class=MsoNormal style='margin-left:36.0pt'>Inndregið</p>`

// A 2x2 desktop-Word table: MsoTableGrid with border/spacing attributes,
// mso border styles, sized and padded cells (no tbody — Word puts tr directly
// under table; the browser parser synthesizes one).
export const WORD_TABLE = `
<table class=MsoTableGrid border=1 cellspacing=0 cellpadding=0 style='border-collapse:collapse;border:none;mso-border-alt:solid windowtext .5pt;mso-yfti-tbllook:1184'>
 <tr style='mso-yfti-irow:0;mso-yfti-firstrow:yes'>
  <td width=301 valign=top style='width:225.4pt;border:solid windowtext 1.0pt;mso-border-alt:solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt'>
  <p class=MsoNormal>Efri vinstri<o:p></o:p></p>
  </td>
  <td width=301 valign=top style='width:225.4pt;border:solid windowtext 1.0pt;border-left:none;padding:0cm 5.4pt 0cm 5.4pt'>
  <p class=MsoNormal>Efri hægri<o:p></o:p></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:1;mso-yfti-lastrow:yes'>
  <td width=301 valign=top style='width:225.4pt;border:solid windowtext 1.0pt;border-top:none;padding:0cm 5.4pt 0cm 5.4pt'>
  <p class=MsoNormal>Neðri vinstri<o:p></o:p></p>
  </td>
  <td width=301 valign=top style='width:225.4pt;border:solid windowtext 1.0pt;border-top:none;border-left:none;padding:0cm 5.4pt 0cm 5.4pt'>
  <p class=MsoNormal>Neðri hægri<o:p></o:p></p>
  </td>
 </tr>
</table>`

// A Word table with merged cells: a two-column merge in the first row
// (colspan) and a two-row merge in the first column below it (rowspan), plus
// a shaded header-ish cell whose background must not become a highlight.
export const WORD_TABLE_MERGED = `
<table class=MsoTableGrid border=1 cellspacing=0 cellpadding=0 style='border-collapse:collapse'>
 <tr>
  <td width=602 colspan=2 valign=top style='width:450.8pt;border:solid windowtext 1.0pt;background:#D9D9D9;padding:0cm 5.4pt 0cm 5.4pt'>
  <p class=MsoNormal>Sameinuð fyrirsögn<o:p></o:p></p>
  </td>
 </tr>
 <tr>
  <td width=301 rowspan=2 valign=top style='width:225.4pt;border:solid windowtext 1.0pt;padding:0cm 5.4pt 0cm 5.4pt'>
  <p class=MsoNormal>Spannar tvær raðir<o:p></o:p></p>
  </td>
  <td width=301 valign=top style='width:225.4pt;border:solid windowtext 1.0pt;padding:0cm 5.4pt 0cm 5.4pt'>
  <p class=MsoNormal>Fyrri<o:p></o:p></p>
  </td>
 </tr>
 <tr>
  <td width=301 valign=top style='width:225.4pt;border:solid windowtext 1.0pt;padding:0cm 5.4pt 0cm 5.4pt'>
  <p class=MsoNormal>Seinni<o:p></o:p></p>
  </td>
 </tr>
</table>`

// A Google Docs table: colgroup with widths, inline styles everywhere, bold
// carried as font-weight:700 on a span.
export const GDOCS_TABLE = `<table style="border:none;border-collapse:collapse;"><colgroup><col width="221"/><col width="222"/></colgroup><tbody><tr style="height:22pt"><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;"><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:700;font-style:normal;">Feitletrað</span></p></td><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;"><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;">Venjulegt</span></p></td></tr></tbody></table>`

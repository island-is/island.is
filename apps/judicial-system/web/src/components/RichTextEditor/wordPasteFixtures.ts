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

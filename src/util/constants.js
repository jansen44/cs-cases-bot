module.exports.rarityGroups = [
  {
    chanceRange: [1, 7992],
    rarities: ['Consumer Grade', 'Industrial Grade', 'Mil-Spec Grade'] // ? White/Blue Skins - 79.92%
  },
  {
    chanceRange: [7993, 9590],
    rarities: ['Restricted'] // ? Purple - 15.98%
  },
  {
    chanceRange: [9591, 9920],
    rarities: ['Classified'] // ? Pink - 3.2%
  },
  {
    chanceRange: [9921, 10000],  // -----------------------------
    rarities: ['Covert'] // ? Red - 0.64% (w/o yellow -> 0.8)    |
  } //                                                           |
] //                                                             |
//                                                               |
//                                                               |
module.exports.maxChanceNumber = 10000 // <----------------------

module.exports.rGIndex = {
  BLUE: 0,
  PURPLE: 1,
  PINK: 2,
  RED: 3
}

module.exports.keyPrice = dolar => (2.50 * dolar).toFixed(2)

/* Yellow – 0.32 items – 0.26% */

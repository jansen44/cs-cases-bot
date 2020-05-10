module.exports.sliceFields = fields => {
  let filteredFields = []

  if (fields.length <= 25) {
    filteredFields.push(fields)
  } else {
    let offset = 0

    while (offset + 25 < fields.length) {
      filteredFields.push(fields.slice(offset, offset + 25))
      offset += 25
    }

    filteredFields.push(fields.slice(offset, fields.length))
  }

  filteredFields = filteredFields.filter(c => c.length > 0)

  return filteredFields
}

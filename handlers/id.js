const { parse: parseUrl } = require('url')
const { send } = require('micro')
const { createError } = require('micro-errors')
const statuses = require('statuses')
const head = require('lodash.head')
const { hotpepper, gurunavi } = require('../externals')
const { isHotpepper, isGurunavi } = require('../helpers')

module.exports = async (req, res) => {
  const { query } = parseUrl(req.url, true)
  const { id } = req.params
  const endpoint = isHotpepper(id) ? hotpepper : (isGurunavi(id) ? gurunavi : null)
  if (!endpoint) {
    throw createError(404, statuses[404], null, null, { detail: 'Invalid ID format' })
  }

  const result = await endpoint({ ...query, id }).catch(error => {
    throw error
  })
  const ret = Array.isArray(result) ? head(result) : result

  if (!ret) {
    throw createError(404, statuses[404])
  }

  send(res, 200, ret)
}

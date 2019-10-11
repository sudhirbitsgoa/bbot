/**
 * Using class for submitted details allows the credentials instance to be
 * accumulated from a sequence of prompts, performing field validation and even
 * returning specific errors from the class in conversation.
 * @todo check username exists on server (error message response => branch loop)
 * @todo check room exists on server (error message response => branch loop)
 */
class Data {

  constructor () {
    this.option = {}
  }

  setPanchnageOption (panchangoption) {
    this.option.panchangoption = panchangoption
    return this
  }

  setLanguageOption (language) {
    this.option.language = language
    return this
  }

  getData () {
     return this.option
  }

  resetData () {
    Object.keys(selectedoptions).forEach((i) => delete selectedoptions[i])
  }

}

/** Store the collection of gathered credentials by the user's ID */
const selectedoptions = {}

/** Get a credential from the collection by ID if exists, otherwise create */
module.exports = (userId) => {
  if (selectedoptions[userId]) return selectedoptions[userId]
  selectedoptions[userId] = new Data()
  return selectedoptions[userId]
}

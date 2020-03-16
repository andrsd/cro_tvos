import ATV from 'atvjs'
import template from 'shared/templates/error.hbs'

const ErrorPage = ATV.Page.create({
  name: 'error',
  template: template,
  ready (options, resolve, reject) {
    resolve(options)
  }
})

export default ErrorPage

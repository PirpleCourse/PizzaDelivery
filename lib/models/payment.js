/*
 * Payment Model
 **/

class Payment {
  static add(name, email, address) {
    console.log('Adding ', arguments)
  }

  static find(email) {
    console.log('Finding ', email)

  }

  static delete(email) {
    console.log('Deleting ', email)

  }

  static update(email) {
    console.log('Updating ', email)

  }
}

Payment.collection = true;

module.exports = Payment;
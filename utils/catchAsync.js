//return a function that accpets a funciton and then catches errors

module.exports = func => {
  return(req, res, next) => {
    func(req, res, next).catch(next);
  }
}
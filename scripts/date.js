const getDate = (value) => {
    const date = new Date()
    date.setDate(date.getDate() + value)

    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()
    const hour = date.getHours()
    const minute = date.getMinutes()

    return `${date}`
}
module.exports = getDate
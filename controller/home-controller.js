const home = (req, res) => {
    return res.render('../views/pages/home/index', {
        // name : 'Aris'
    })
}

const login = (req, res) => {
    return res.render('../views/pages/home/login', {
        // name : 'Aris'
    })
}

const register = (req, res) => {
    return res.render('../views/pages/home/register', {
        // name : 'Aris'
    })
}

module.exports = {
    home, login, register
}
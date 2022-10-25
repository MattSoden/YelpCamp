const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        let error = e.message;
        if (error.includes('duplicate') && error.includes('index: email_1 dup key')) {
            error = 'The email is already registered!';
        }
        req.flash('error', error);
        res.redirect('register');
    }    
}

module.exports.renderLogin = (req, res) => {
    if(req.query.returnTo) {
        req.session.returnTo = req.query.returnTo;
    }
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success', 'Succesfully Logged Out');
        res.redirect('/campgrounds');
    });
}

const express = require('express');
const router = express.Router();
const User = require("../database/models/User");
const validator = require("validator");
const erorrHandler = require("../utils/errorHandler")
const {tokenCheker, generateToken, tokenCheker2} = require("../utils/session")



router.get("/login", tokenCheker2,(req, res) => {
  // console.log(req);
  console.log(req.cookies);
  const msg = req.query
  res.render("login", { msg })
})

router.get("/regester", tokenCheker2,(req, res) => {  
  if (Object.keys(req.query).length === 0) {
    const inputIsValid = [false, false, false, false, false, false];
    res.render("regester", {inputIsValid});
  } else {
    const inputIsValid = JSON.parse(req.query.value);
  res.render("regester", {inputIsValid})
  }
  
})

router.get("/loginPhone", tokenCheker2,(req, res) => {
  const msg = req.query
  res.render("loginphonnumber", { msg })
})

router.get("/dashbord", tokenCheker,async (req, res) => {
    const targetUser = res.locals.user   
    res.render("dashbord",  targetUser )
})

router.post("/isregester", async (req, res) => {

  try {
    if (!req.body.FerstName || !req.body.LastName || !req.body.UserName || !req.body.Password || !req.body.PhoneNumber) {
      // return res.status(406).json({ msg: 'Not Acceptable 1' });
      return res.redirect(`/auth/regester/?value=[true, false, false, false, false, false]`);
      // return res.render('register', {msg: 'Not Acceptable'})
    };

    if (req.body.FerstName.length > 30 || req.body.FerstName.length < 3) {
      // return res.status(406).json({ msg: 'Not Acceptable 2' });
      return res.redirect(`/auth/regester/?value=[true, false, false, false, false, false]`);
      // return res.render('register', { msg: 'Not Acceptable' });
    };

    if (req.body.LastName.length > 30 || req.body.LastName.length < 3) {
      // return res.status(406).json({ msg: 'Not Acceptable 3' });
      return res.redirect(`/auth/regester/?value=[false, true, false, false, false, false]`);
      // return res.render('register', { msg: 'Not Acceptable' });
    };

    if (req.body.UserName.length > 30 || req.body.UserName.length < 3) {
      // return res.status(406).json({ msg: 'Not Acceptable 4' });
      return res.redirect(`/auth/regester/?value=[false, false, true, false, false, false]`);
      // return res.render('register', { msg: 'Not Acceptable' });
    };

    if (req.body.Password.length > 30 || req.body.Password.length < 4) {
      // return res.status(406).json({ msg: 'Not Acceptable 5' });
      return res.redirect(`/auth/regester/?value=[false, false, false, true, false, false]`);
      // return res.render('register', { msg: 'Not Acceptable' });
    };

    if (!validator.isMobilePhone(req.body.PhoneNumber, "fa-IR")) {
      // return res.status(406).json({ msg: 'Not Acceptable 6' });
      return res.redirect(`/auth/regester/?value=[false, false, false, false, true, false]`);
      // return res.render('register', { msg: 'Not Acceptable' });
    };

    
    username = await User.findOne({ where: { UserName: req.body.UserName } });
    phonenumber = await User.findOne({ where: { PhoneNumber: req.body.PhoneNumber } });
    console.log(username);
    console.log(phonenumber);
    
    if (username) {
      // return res.status(406).json({ msg: 'there is this username' });
      return res.redirect(`/auth/regester/?value=[false, false, true, false, false, false]`);
    }
    if (phonenumber) {
      return res.redirect(`/auth/regester/?value=[false, false, false, false, false, true]`);
      // return res.status(406).json({ msg: 'there is this phonenumber' });
    }

    const user = await User.create({
      FerstName: req.body.FerstName,
      LastName: req.body.LastName,
      UserName: req.body.UserName,
      Password: req.body.Password,
      PhoneNumber: req.body.PhoneNumber,
      Gender: req.body.Gender
    })
    res.status(201).redirect("/auth/login")
  } catch (error) {
    erorrHandler(res, error)
  }

})

router.post("/islogin", async (req, res) => {
  try {
    
    
    const user = await User.findOne({where:{ UserName: req.body.UserName }});
   

    if (req.body.PhoneNumber) {
      if (req.body.UserName.length > 30 || req.body.UserName.length < 3 || !validator.isMobilePhone(req.body.PhoneNumber, "fa-IR")) {
        // return res.status(406).json({msg: 'Not Acceptable 4'});
        return res.redirect(`/auth/loginPhone/?msg=Not acceptable username or phoneNumber`);
        // return res.render('register', { msg: 'Not Acceptable' });
      };
    

      if (!user || !(req.body.PhoneNumber === user.dataValues.PhoneNumber)) {
        return res.redirect(`/auth/loginPhone/?msg=PhoneNumber or username in correct`);
        // return res.status(406).json({ msg: "username or password not correct" });
      }
      const token = await generateToken(user);
      res.cookie('token', token.toString(), { maxAge: 30*60*1000, httpOnly: true, path: "/"});
         
      res.redirect("/auth/dashbord")
      

    }else {
      
      if (req.body.UserName.length > 30 || req.body.UserName.length < 3 || req.body.Password.length > 30 || req.body.Password.length < 4) {
        // return res.status(406).json({msg: 'Not Acceptable 4'});
        return res.redirect(`/auth/login/?msg=Not acceptable username or password`);
        // return res.render('register', { msg: 'Not Acceptable' });
      };
      

      if (!user || !(req.body.Password === user.dataValues.Password)) {
        return res.redirect(`/auth/login/?msg=password or username in correct`);
        // return res.status(406).json({ msg: "username or password not correct" });
      };

      const token = await generateToken(user);
      res.cookie('token', token.toString(), { maxAge: 30*60*1000, httpOnly: true, path: "/"});
         
      res.redirect("/auth/dashbord")
      
    }
    
    
  } catch (error) {
    
    erorrHandler(res, error);
  }
})




module.exports = router;

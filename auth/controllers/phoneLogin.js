const axios = require("axios");
const Joi = require("joi");
//////////////////////////////////////phone login///////////////////////////
exports.phoneLogin = (req, res) => {
  const { body } = req;
  const blogSchema = Joi.object()
    .keys({
      phone: Joi.string()
        .regex(/^[6-9]{1}[0-9]{9}$/)
        .required(),
    })
    .required();
  let result = blogSchema.validate(body);
  if (result.error) {
    res.send("Please enter a valid number");
  } else {
    const val = Math.floor(1000 + Math.random() * 9000);
    axios
      .get(
        "https://2factor.in/API/V1/c7573668-cfde-11ea-9fa5-0200cd936042/SMS/" +
          req.body.phone +
          "/" +
          val
      )
      .then(function (response) {
        res.send(response.data);
      })
      .catch((er) => {
        res.send({ Status: "Error" });
      });
  }
};

//////////////////////////////////verifyOTP/////////////////////////////////
exports.verifyOTP = (req, res) => {
  const { body } = req;
  const otpSchema = Joi.object()
    .keys({
      details: Joi.string().required(),
      otp: Joi.number().max(9999).required(),
      phone: Joi.string()
        .regex(/^[6-9]{1}[0-9]{9}$/)
        .required(),
    })
    .required();
  let result = otpSchema.validate(body);
  if (result.error) {
    res.send("Please enter a valid details");
  } else {
    axios
      .get(
        "https://2factor.in/API/V1/c7573668-cfde-11ea-9fa5-0200cd936042/SMS/VERIFY/" +
          req.body.details +
          "/" +
          req.body.otp
      )
      .then(function (response) {
        if (response.data.Details === "OTP Matched") {
          const token = jwt.sign({ userPhone: req.body.phone }, "123456", {
            expiresIn: "24h",
          });
          response.data.token = token;
          res.status(200);
          res.send(response.data);
        }
      })
      .catch((er) => {
        res.send({ Status: "Error", Details: "Invalid OTP" });
      });
  }
};

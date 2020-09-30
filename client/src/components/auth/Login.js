import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../../actions/auth";
import PropTypes from "prop-types";
import Alert from "../layout/Alert";

const Login = ({ login, isAuthenticated }) => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  //destructure values
  const { email, password } = values;

  //on input change
  const onChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  //on submit form
  const onSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  //redirect to dashboard
  if (isAuthenticated) {
    return <Redirect to={"/dashboard"} />;
  }

  return (
    <Fragment>
      <Alert />
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Login to Your Account
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            name="email"
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>

        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Dont't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  );
};

Login.protoType = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);

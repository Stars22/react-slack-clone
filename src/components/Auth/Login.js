import React, { Component } from "react";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";


class Login extends Component {
  state = {
    email: "",
    password: "",
    errors: [],
    loading: false,
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // isFormEmpty = ({email, password}) => {
  //   return !(email.length && password.length);
  // };


  isFormValid = ({email, password}) => {
    return email.length && password.length > 6
  };

  translateErrorMessage = (error) => {
    if(error.code) {
      switch(error.code) {
        case 'auth/email-already-in-use':
          return 'Данный почтовый адрес уже используется'
        default:
          return error.message
      }
    }  
    return error.message
  }

  handleInputError = (errors, inputName) => {
    return errors.some((error) => error.message.includes(inputName)) ? 'error' : ''
  }

  displayErrors = errors =>
    errors.map((error, ind) => <p key={ind}>{this.translateErrorMessage(error)}</p>);

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({errors: [], loading: true});
      firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(signedUser => console.log(signedUser))
      .catch(error => this.setState({errors: this.state.errors.concat(error), loading: false}))
    }
  };

  render() {
    const { email, password, errors, loading } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon textAlign="center" color="violet">
            <Icon name="code" color="violet" />
            Авторизация
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Имаил"
                onChange={this.handleChange}
                type="email"
                value={email}
                className={this.handleInputError(errors, 'email')}
              />

              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Пароль"
                onChange={this.handleChange}
                type="password"
                value={password}
                className={this.handleInputError(errors, 'password')}
              />

              <Button color="violet" 
                fluid size="large" 
                disabled={loading} 
                className={loading ? 'loading' : ''}>
                Отправить
              </Button>
              {errors.length > 0 && (
                <Message negative>
                  <h3>Ошибка</h3>
                  {this.displayErrors(errors)}
                </Message>
              )}
              <Message>
                Не зарегистрированы? <Link to="/register">Зарегистрироваться</Link>
              </Message>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;

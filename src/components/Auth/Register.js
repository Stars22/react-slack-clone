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
import md5 from 'md5';


class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loading: false,
    usersRef: firebase.database().ref('users')
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return !(
      username.length &&
      email.length &&
      password.length &&
      passwordConfirmation.length
    );
  };

  isPasswordValid = ({ password, passwordConfirmation }) => {
    return password === passwordConfirmation && password.length > 6;
  };

  isFormValid = () => {
    let errors = [];
    let error = null;
    if (this.isFormEmpty(this.state)) {
      error = { message: "Пожалуйста, заполните все поля формы" };
      errors.push(error)
      this.setState({ errors });
      return false;
    }

    if (!this.isPasswordValid(this.state)) {
      error = { message: "Неверный пароль" };
      this.setState({ errors: errors.concat(error) });
      return false;
    }

    return true;
  };

  translateErrorMessage = (error) => {
    if(error.code) {
      switch(error.code) {
        case 'auth/email-already-in-use':
          return 'Данный почтовый адрес уже используется'
        default:
          return 'Неизвестная ошибка'
      }
    }  
    return error.message
  }

  handleInputError = (errors, inputName) => {
    return errors.some((error) => error.message.includes(inputName)) ? 'error' : ''
  }

  displayErrors = errors =>
    errors.map((error, ind) => <p key={ind}>{this.translateErrorMessage(error)}</p>);

  saveUser = createdUser => {
    return this.state.usersRef.child(createdUser.user.uid)
    .set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid()) {
      this.setState({errors: [], loading: true});
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          console.log(createdUser);
          createdUser.user.updateProfile({
            displayName: this.state.username,
            photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
          })
          .then(() => {
            this.saveUser(createdUser).then(() => console.log('user saved'))
          })
        })
        .then(() => {
          this.setState({loading: false})
        })
        .catch(err => {
          //console.error(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err)
          });
          console.log(err);
        });
    }
  };

  render() {
    const { username, email, password, passwordConfirmation, errors, loading } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon textAlign="center" color="blue">
            <Icon name="microphone" color="blue" />
            Пожалуйста, зарегистрируйтесь
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Логин"
                onChange={this.handleChange}
                type="text"
                value={username}
              />

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
                className={this.handleInputError(errors, 'пароль')}
              />

              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="lock"
                iconPosition="left"
                placeholder="Подтверждение пароля"
                onChange={this.handleChange}
                type="password"
                value={passwordConfirmation}
                className={this.handleInputError(errors, 'пароль')}
              />

              <Button color="green" 
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
                Уже зарегистрированы? <Link to="/login">Войти</Link>
              </Message>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;

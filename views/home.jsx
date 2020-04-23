var React = require('react');

class UsersNew extends React.Component {
  render() {

    let userButtons = (<div><p><a href="/registration">register</a></p>
                       <p><a href="/login">login</a></p></div>);

    if( this.props.loggedIn === true){
        userButtons = (<div>
              <h2>welcome {this.props.user.name}</h2>
            <form action="/logout?_method=delete" method="POST">
                        <input type="submit" value="logout"/>
                </form>
                </div>);
    }

    return (
      <html>
        <body>
          <h1>home</h1>
          {userButtons}
          <script src="script.js"></script>
        </body>
      </html>
    );
  }
}

module.exports = UsersNew;
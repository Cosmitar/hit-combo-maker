'use strict'
import React, {Component} from 'react';
import SearchBar from './components/SearchBar';
import Footer from './components/Footer';
import Layouts from './components/Layouts'
import Modal from './components/modal/ModalComponent';
import LoginFrame from './components/LoginFrame';

import SearchStore from './stores/SearchStore';
import ArtistsListStore from './stores/ArtistsListStore';
import CombosListStore from './stores/CombosListStore';
import LoginStore from './stores/LoginStore';

let getState = () => {
    return {
        currentSearch: SearchStore.getSearch(),
        currentArtists: [...ArtistsListStore.getList().values()],
        totalArtists: ArtistsListStore.getTotal(),
        currentCombos: CombosListStore.getList(),
        playlistDuration: CombosListStore.getDuration(),
        isLoggedIn: LoginStore.isLoggedIn(),
        loginUrl: LoginStore.getLoginUrl(),
        showLogin: false
    }
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = getState();
    }

    componentDidMount() {
        SearchStore.addChangeListener(this._onChange.bind(this));
        ArtistsListStore.addChangeListener(this._onChange.bind(this));
        CombosListStore.addChangeListener(this._onChange.bind(this));
        LoginStore.addChangeListener(this._onChange.bind(this));
    }

    componentWillUnmount() {
        SearchStore.removeChangeListener(this._onChange.bind(this));
        ArtistsListStore.removeChangeListener(this._onChange.bind(this));
        CombosListStore.removeChangeListener(this._onChange.bind(this));
        LoginStore.removeChangeListener(this._onChange.bind(this));
    }

    render() {
        //        <button onClick={this._openLoginModal.bind(this)}>open</button>
        return (
            <Layouts.home state={this.state}>
                <Modal isOpen={this.state.showLogin} onClose={this._onCloseLoginModal.bind(this)}>
                    <LoginFrame isLoggedIn={this.state.isLoggedIn} src={this.state.loginUrl}/>
                </Modal>
            </Layouts.home>
        );
    }

    _onCloseLoginModal() {
        this.setState({showLogin: false});
    }
    _openLoginModal() {
        this.setState({showLogin: true});
    }

    _onChange() {
        this._updateState();
    }

    _updateState() {
        let newState = getState();
        //auto close login modal when login callback
        newState.showLogin = !this.state.isLoggedIn && newState.isLoggedIn? false : newState.showLogin;
        this.setState(newState);
    }

}

export default App;
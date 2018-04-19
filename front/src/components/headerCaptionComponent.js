import React, {Component} from 'react';
// import {connect} from 'react-redux';

class _HeaderCaptionComponent extends Component {

    render() {
        console.log("headerCaptionComponent props", this.props);
        return (<span>Almau - Chat-Center</span>)
    }
}


const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {
};

// const HeaderCaptionComponent = connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(_HeaderCaptionComponent);

export default _HeaderCaptionComponent;
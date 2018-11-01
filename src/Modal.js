import React from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import './App.css';
import ReactMarkdown from 'react-markdown';
import HOWITWORKS from './HOWITWORKS.md' 

class AboutModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      terms: null
    };

    this.toggle = this.toggle.bind(this);
    
}
        
    componentWillMount = () => {
        fetch(HOWITWORKS).then((response) => response.text()).then((text) => {
            this.setState({
                terms: text
            })
        })
    }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    return (
      <div>
        <Button color="danger" onClick={this.toggle} className="ModalButton">How I built this</Button>
        <Modal isOpen={this.state.modal} fade={false} toggle={this.toggle} className="ModalStyles">
          <ModalHeader toggle={this.toggle}>How I built Conway's Game of Life the React way.</ModalHeader>
          <ModalBody>
          <ReactMarkdown source={this.state.terms}/>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default AboutModal;
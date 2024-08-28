import styled from "styled-components";
import {HiXMark} from "react-icons/hi2";
import {createPortal} from "react-dom";
import {cloneElement, createContext, useContext, useState} from "react";
import {useOutsideClick} from "../hooks/useOutsideClick.js";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;

export const ModalContext = createContext();

/**
 * Modal component, has the openName state, which controls the content that's opened. Uses context provider to pass
 * state values and function to child components.
 * @param children
 *  The contents to be displayed inside the modal.
 * @returns {JSX.Element}
 * @constructor
 */
function Modal({children}) {
    const [openName, setOpenName] = useState("");
    // Sets open name to empty.
    const closeModal = () => setOpenName("");

    return (
        <ModalContext.Provider value={{setOpenName, closeModal, openName}}>
            {children}
        </ModalContext.Provider>
    )
}

/**
 * The modal open component, responsible for setting the openName state value using the "opens/contentName".
 * @param children
 *  The contents to be displayed inside the Modal.Open component.
 * @param opens|opensContentName
 *  The value of the "opens" prop where the Modal.Open component is defined.
 * @returns {React.DetailedReactHTMLElement<{onClick: (function(): *)}, HTMLElement>}
 * @constructor
 */
function Open({children, opens: contentName}) {
    // Get setOpenName function from context, so we can set the state from outside the modal component.
    const {setOpenName} = useContext(ModalContext);

    // Clone the children element (what's inside <Modal.Open></Modal.Open>), and then we add the onClick prop onto it
    // with the setOpenName function, so that when the button is clicked, the openName state becomes the value passed
    // through the function (contentName) in this case.
    return cloneElement(children, {onClick: () => setOpenName(contentName)});
}

/**
 * The modal content component, responsible for display the contents of the modal.
 * @param children
 *  The contents to be displayed inside the Modal.Content component.
 * @param name
 *  The value of the "name" prop where the Modal.Content component is defined. This is used by the "opens" props
 *  on the Modal.Open component to open the corresponding content.
 * @returns {React.ReactPortal|null}
 * @constructor
 */
function Content({children, name}) {
    // Get openName state value and close function from context.
    const {openName, closeModal} = useContext(ModalContext);

    const ref = useOutsideClick(closeModal);

    // If the value of the name prop isn't the same as the openName state value, don't do anything.
    if (name !== openName) return null;
    // Create portal renders the modal inside the document body on the specified element (document.body).
    return createPortal(
        <Overlay>
            <StyledModal ref={ref}>
                <Button onClick={closeModal}>
                    <HiXMark />
                </Button>
                {/* Clone the children inside <Modal.Content> and pass the close function through the onCloseModal prop
                  so that, the modal can be closed from a component a few levels inside it. */}
                {cloneElement(children, {onCloseModal: closeModal})}
            </StyledModal>
        </Overlay>
        ,
        document.body
    );
}

// Set Content and Open components as properties on the Modal component. This is what allows us to do <Modal.Open>.
Modal.Content = Content;
Modal.Open = Open;

export default Modal;
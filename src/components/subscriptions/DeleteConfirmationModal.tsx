import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';

interface DeleteConfirmationModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  visible,
  onCancel,
  onConfirm,
}) => {
  // Handle backdrop press - dismiss the modal
  const handleBackdropPress = () => {
    onCancel();
  };

  // Handle confirm with proper error handling
  const handleConfirm = () => {
    try {
      onConfirm();
    } catch (error) {
      console.error('Error in confirmation handler:', error);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
      statusBarTranslucent={true}
      supportedOrientations={['portrait', 'landscape']}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <View style={styles.dialog}>
                <Text style={styles.title}>Delete Subscription?</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={onCancel}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={handleConfirm}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    maxWidth: 400,
  },
  dialog: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButtonText: {
    color: '#007AFF',
    fontWeight: '500',
    fontSize: 16,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
});

export default DeleteConfirmationModal;

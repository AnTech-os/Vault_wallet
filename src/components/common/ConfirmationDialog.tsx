import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';

interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonColor?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  confirmButtonColor = '#FF3B30',
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backgroundDismiss} onPress={onCancel} />
        <View style={styles.dialogContainer}>
          <View style={styles.dialog}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onCancel}
              >
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.confirmButton,
                  { backgroundColor: confirmButtonColor },
                ]}
                onPress={onConfirm}
              >
                <Text style={styles.confirmButtonText}>{confirmText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
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
  backgroundDismiss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dialogContainer: {
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
    marginBottom: 10,
    textAlign: 'center',
    color: '#000',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  confirmButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButtonText: {
    color: '#007AFF',
    fontWeight: '500',
    fontSize: 16,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
});

export default ConfirmationDialog;

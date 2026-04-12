import { X } from 'lucide-react-native';
import {
  Image,
  Modal,
  Pressable,
  StatusBar,
  View,
  useWindowDimensions,
} from 'react-native';

type Props = {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
};

export function ReceiptPreviewModal({ visible, imageUri, onClose }: Props) {
  const { width, height } = useWindowDimensions();

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <StatusBar barStyle="light-content" />
      <View className="flex-1 bg-black">
        <Pressable
          onPress={onClose}
          className="absolute right-4 top-14 z-10 rounded-full bg-neutral-800/90 p-2"
          hitSlop={12}
        >
          <X color="#fafafa" size={24} />
        </Pressable>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width, height }}
            resizeMode="contain"
          />
        ) : null}
      </View>
    </Modal>
  );
}

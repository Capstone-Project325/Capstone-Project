import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { CartItem, formatPrice } from "@/context/CartContext";
import { CartColors as C } from "@/constants/cart-colors";

type Props = {
  item: CartItem;
  index: number;
  onEdit: () => void;
  onRemove: () => void;
};

export function CartItemCard({ item, index, onEdit, onRemove }: Props) {
  return (
    <View style={s.card}>
      <View style={s.header}>
        <Text style={s.cardTitle}>Item {index + 1}</Text>
        <View style={s.btnRow}>
          <Pressable style={s.smallBtn} onPress={onEdit}>
            <Text style={s.smallBtnText}>Edit</Text>
          </Pressable>
          <Pressable style={s.smallBtn} onPress={onRemove}>
            <Text style={s.smallBtnText}>Remove</Text>
          </Pressable>
        </View>
      </View>

      <View style={s.itemRow}>
        <Image source={{ uri: item.image}} style={s.image} />
        <View style={{ marginLeft: 16 }}>
          <Text style={s.itemName}>{item.name}</Text>
          <Text style={s.sub}>Qty: {item.quantity}</Text>
          <Text style={s.sub}>
            Each <Text style={s.each}>{formatPrice(item.unitPrice)}</Text>
          </Text>
        </View>
      </View>

      <Text style={s.label}>Customizations</Text>
      <Text style={s.sub}>
        {item.customizations.length ? item.customizations.join(", ") : "Standard preparation"}
      </Text>

      <View style={s.totalRow}>
        <Text style={s.label}>Item total</Text>
        <Text style={s.label}>{formatPrice(item.unitPrice * item.quantity)}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16, marginBottom: 24 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { color: C.green, fontSize: 18, fontWeight: "700" },
  btnRow: { flexDirection: "row", gap: 8 },
  smallBtn: { borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16 },
  smallBtnText: { color: C.green, fontWeight: "600" },
  itemRow: { flexDirection: "row", marginVertical: 16 },
  image: { width: 106, height: 106, borderRadius: 16 },
  itemName: { color: C.green, fontSize: 22, fontWeight: "700", marginBottom: 4 },
  sub: { color: C.mutedGreen, fontSize: 15, marginBottom: 2 },
  each: { color: C.green, fontSize: 18, fontWeight: "600" },
  label: { color: C.green, fontWeight: "700", fontSize: 16, marginBottom: 4 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
});

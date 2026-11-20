import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCart, formatPrice } from "@/context/CartContext";
import { CartItemCard } from "@/constants/cart-item-card";
import { CartColors as C } from "@/constants/cart-colors";

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, totals, dispatch } = useCart();
  const isEmpty = items.length === 0;

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.content}>
        <Pressable onPress={() => router.back()} style={{ marginBottom: 24 }}>
          <Text style={s.backText}>‹  Back to menu</Text>
        </Pressable>

        <Text style={s.title}>Checkout</Text>
        <Text style={s.sub}>
          {isEmpty
            ? "Your cart is empty."
            : `${totals.count} item${totals.count > 1 ? "s" : ""} in your cart`}
        </Text>

        <Pressable style={s.outlineBtn} onPress={() => router.push("/")}>
          <Text style={s.outlineBtnText}>{isEmpty ? "Add items" : "Add more items"}</Text>
        </Pressable>

        {isEmpty ? (
          <View style={s.emptyCard}>
            <Text style={s.emptyTitle}>Your cart is empty</Text>
            <Text style={s.sub}>Add a burger, side, or drink to get started.</Text>
          </View>
        ) : (
          <>
            {items.map((item, i) => (
              <CartItemCard
                key={item.lineId}
                item={item}
                index={i}
                onEdit={() => router.push(`/item/${item.lineId}`)}
                onRemove={() => dispatch({ type: "REMOVE", lineId: item.lineId })}
              />
            ))}

            <Text style={s.sectionTitle}>Price details</Text>
            <View style={s.priceRow}>
              <Text style={s.priceLabel}>Subtotal</Text>
              <Text style={s.priceValue}>{formatPrice(totals.subtotal)}</Text>
            </View>
            <View style={s.priceRow}>
              <Text style={s.priceLabel}>Estimated tax (8%)</Text>
              <Text style={s.priceValue}>{formatPrice(totals.tax)}</Text>
            </View>
            <Text style={s.note}>Tax is estimated and may vary at payment.</Text>
          </>
        )}
      </ScrollView>

      <View style={s.footer}>
        <Pressable
          disabled={isEmpty}
          onPress={() => router.push("/payment")}
          style={s.totalBar}
        >
          <Text style={s.totalText}>Total</Text>
          <Text style={s.totalText}>{formatPrice(totals.total)}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingBottom: 40 },
  backText: { color: C.green, fontWeight: "600", fontSize: 16 },
  title: { color: C.green, fontSize: 32, fontWeight: "700", marginBottom: 8 },
  sub: { color: C.mutedGreen, fontSize: 15, marginBottom: 2 },
  outlineBtn: { borderWidth: 1, borderColor: C.green, borderRadius: 10, paddingVertical: 16, alignItems: "center", marginVertical: 16 },
  outlineBtnText: { color: C.green, fontWeight: "700", fontSize: 16 },
  emptyCard: { backgroundColor: C.lightGreen, borderRadius: 20, padding: 22, marginTop: 8 },
  emptyTitle: { color: C.green, fontSize: 20, fontWeight: "700", marginBottom: 8 },
  sectionTitle: { color: C.green, fontSize: 22, fontWeight: "700", marginBottom: 12 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 14 },
  priceLabel: { color: C.mutedGreen, fontSize: 17 },
  priceValue: { color: C.green, fontSize: 17, fontWeight: "700" },
  note: { color: C.mutedGreen, fontSize: 13 },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: "#E5E5E5", backgroundColor: "#fff" },
  totalBar: { backgroundColor: C.green, borderRadius: 14, paddingVertical: 20, paddingHorizontal: 22, flexDirection: "row", justifyContent: "space-between" },
  totalText: { color: "#fff", fontSize: 20, fontWeight: "700" },
});

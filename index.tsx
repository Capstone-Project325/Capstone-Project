import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const categories = ['Burgers', 'Chicken', 'Sides', 'Drinks', 'Combos'] as const;
type Category = (typeof categories)[number];

type MenuItem = {
  id: string;
  name: string;
  description: string;
  category: Category;
  image: string;
};

const menuItems: MenuItem[] = [
  {
    id: 'classic-burger',
    name: 'Classic Cheeseburger',
    description: 'Grilled beef, cheddar, crisp lettuce, tomato, and house sauce.',
    category: 'Burgers',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=720&q=85',
  },
  {
    id: 'garden-burger',
    name: 'Garden Stack',
    description: 'A juicy veggie patty with avocado, greens, and tangy slaw.',
    category: 'Burgers',
    image:
      'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=720&q=85',
  },
  {
    id: 'crispy-chicken',
    name: 'Crispy Chicken Sandwich',
    description: 'Crunchy chicken, pickles, and cool herb mayo on a toasted bun.',
    category: 'Chicken',
    image:
      'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=720&q=85',
  },
  {
    id: 'grilled-chicken',
    name: 'Grilled Chicken Club',
    description: 'Smoky grilled chicken with fresh greens and ripe tomato.',
    category: 'Chicken',
    image:
      'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=720&q=85',
  },
  {
    id: 'golden-fries',
    name: 'Golden Fries',
    description: 'Crispy, golden-cut potatoes finished with a pinch of sea salt.',
    category: 'Sides',
    image:
      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=720&q=85',
  },
  {
    id: 'onion-rings',
    name: 'Onion Rings',
    description: 'Sweet onions in a light, crunchy golden coating.',
    category: 'Sides',
    image:
      'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=720&q=85',
  },
  {
    id: 'lemonade',
    name: 'Fresh Lemonade',
    description: 'Bright, refreshing lemonade with a fresh citrus finish.',
    category: 'Drinks',
    image:
      'https://images.unsplash.com/photo-1656936637945-571e3f0893f9?auto=format&fit=crop&w=720&q=85',
  },
  {
    id: 'iced-tea',
    name: 'Peach Iced Tea',
    description: 'Chilled black tea with a hint of sweet, ripe peach.',
    category: 'Drinks',
    image:
      'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=720&q=85',
  },
  {
    id: 'burger-combo',
    name: 'Burger Combo',
    description: 'A classic cheeseburger served with golden fries and a drink.',
    category: 'Combos',
    image:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=720&q=85',
  },
  {
    id: 'chicken-combo',
    name: 'Chicken Combo',
    description: 'Crispy chicken sandwich with fries and a refreshing drink.',
    category: 'Combos',
    image:
      'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=720&q=85',
  },
];

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Burgers');
  const [addedItems, setAddedItems] = useState<string[]>([]);
  const visibleItems = menuItems.filter((item) => item.category === selectedCategory);

  function addItem(itemId: string) {
    setAddedItems((currentItems) =>
      currentItems.includes(itemId) ? currentItems : [...currentItems, itemId],
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <Text style={styles.brandMarkText}>M</Text>
            </View>
            <Text style={styles.brandName}>MenuExpress</Text>
          </View>
          <Text style={styles.eyebrow}>FRESHLY MADE, JUST FOR YOU</Text>
          <Text style={styles.heading}>Order</Text>
          <Text style={styles.subheading}>What sounds good today?</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}>
          {categories.map((category) => {
            const isSelected = category === selectedCategory;
            return (
              <Pressable
                key={category}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => setSelectedCategory(category)}
                style={[styles.categoryButton, isSelected && styles.categoryButtonSelected]}>
                <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.menuHeadingRow}>
          <Text style={styles.sectionHeading}>{selectedCategory}</Text>
          <Text style={styles.itemCount}>{visibleItems.length} favorites</Text>
        </View>

        <View style={styles.itemList}>
          {visibleItems.map((item) => {
            const isAdded = addedItems.includes(item.id);
            return (
              <View key={item.id} style={styles.itemCard}>
                <Image source={{ uri: item.image }} style={styles.itemImage} contentFit="cover" />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${isAdded ? 'Added' : 'Add'} ${item.name}`}
                    onPress={() => addItem(item.id)}
                    style={({ pressed }) => [
                      styles.addButton,
                      isAdded && styles.addButtonAdded,
                      pressed && styles.buttonPressed,
                    ]}>
                    <Text style={[styles.addButtonText, isAdded && styles.addButtonTextAdded]}>
                      {isAdded ? 'Added' : 'Add'}
                    </Text>
                    {!isAdded && <Text style={styles.addButtonPlus}>+</Text>}
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    width: '100%',
    maxWidth: 920,
    alignSelf: 'center',
    paddingBottom: 36,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 22,
    backgroundColor: '#F5FAF5',
    borderBottomWidth: 1,
    borderBottomColor: '#E6EEE6',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
  },
  brandMark: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E7745',
  },
  brandMarkText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  brandName: {
    color: '#193D2A',
    fontSize: 17,
    fontWeight: '700',
  },
  eyebrow: {
    color: '#4F8A63',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  heading: {
    color: '#17241B',
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '800',
  },
  subheading: {
    color: '#66736A',
    fontSize: 15,
    marginTop: 5,
  },
  categoryList: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 22,
    gap: 10,
  },
  categoryButton: {
    minHeight: 42,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#DCE5DD',
    backgroundColor: '#FFFFFF',
  },
  categoryButtonSelected: {
    backgroundColor: '#1E7745',
    borderColor: '#1E7745',
  },
  categoryText: {
    color: '#526157',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
  },
  menuHeadingRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  sectionHeading: {
    color: '#17241B',
    fontSize: 22,
    fontWeight: '700',
  },
  itemCount: {
    color: '#7B887E',
    fontSize: 13,
  },
  itemList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  itemCard: {
    minHeight: 154,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E7ECE7',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  itemImage: {
    width: 126,
    minHeight: 154,
    backgroundColor: '#EDF2ED',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemName: {
    color: '#1C2A20',
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '700',
  },
  itemDescription: {
    color: '#6E796F',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 5,
    marginBottom: 12,
  },
  addButton: {
    minWidth: 92,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 14,
    borderRadius: 7,
    backgroundColor: '#1E7745',
  },
  addButtonAdded: {
    backgroundColor: '#EAF4EC',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  addButtonTextAdded: {
    color: '#1E7745',
  },
  addButtonPlus: {
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 18,
    fontWeight: '500',
  },
  buttonPressed: {
    opacity: 0.78,
  },
});
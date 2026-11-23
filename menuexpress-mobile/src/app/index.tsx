import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const categories = ['Burgers', 'Chicken', 'Veggie', 'Sides', 'Drinks'] as const;
type Category = (typeof categories)[number];

const allergenOptions = [
  { id: 'peanuts', name: 'Peanuts' },
  { id: 'tree_nuts', name: 'Tree Nuts' },
  { id: 'milk', name: 'Milk' },
  { id: 'eggs', name: 'Eggs' },
  { id: 'wheat', name: 'Wheat' },
  { id: 'soy', name: 'Soy' },
  { id: 'sesame', name: 'Sesame' },
  { id: 'shellfish', name: 'Shellfish' },
];

type MenuItem = {
  id: string;
  name: string;
  description: string;
  category: Category;
  price: string;
  image: string;
  is_available: boolean;
  allergens?: string[] | null;
  ingredients?: string[] | null;
};

type ApiMenuItem = {
  id: number | string;
  name: string;
  description: string;
  category: Category;
  price: string;
  image: string;
  is_available: boolean;
  allergens: string[] | null;
  ingredients: string[] | null;
};

const menuItems: MenuItem[] = [
  {
    id: 'mr-big',
    name: 'Mr. Big',
    description: 'Signature beef burger with a toasted bun and classic toppings.',
    category: 'Burgers',
    price: '8.35',
    image:
      'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=720&q=85',
    is_available: true,
  },
  {
    id: 'double-mr-big',
    name: 'Double Mr. Big',
    description: 'Two signature beef patties with a toasted bun and classic toppings.',
    category: 'Burgers',
    price: '9.15',
    image:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=720&q=85',
    is_available: true,
  },
  {
    id: 'cheeseburger-single',
    name: 'Cheeseburger Single',
    description: 'A beef patty with melted cheese on a toasted bun.',
    category: 'Burgers',
    price: '7.50',
    image:
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=720&q=85',
    is_available: true,
  },
  {
    id: 'cheeseburger-double',
    name: 'Cheeseburger Double',
    description: 'Two beef patties with melted cheese on a toasted bun.',
    category: 'Burgers',
    price: '8.95',
    image:
      'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=720&q=85',
    is_available: true,
  },
  {
    id: 'cluckin-classic',
    name: 'Cluckin\' Classic',
    description: 'Crispy chicken fillet with fresh toppings on a toasted bun.',
    category: 'Chicken',
    price: '7.95',
    image:
      'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=720&q=85',
    is_available: true,
  },
  {
    id: 'cluckin-tenders',
    name: 'Cluckin\' Tenders',
    description: 'Four hand-breaded chicken tenders, fried until golden.',
    category: 'Chicken',
    price: '8.99',
    image:
      'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=720&q=85',
    is_available: true,
  },
  {
    id: 'cluckin-nuggets',
    name: 'Cluckin\' Nuggets',
    description: 'Four crisp, golden chicken nuggets.',
    category: 'Chicken',
    price: '6.99',
    image:
      'https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=720&q=85',
    is_available: true,
  },
  {
    id: 'veggie-single',
    name: 'Veggie Single',
    description: 'A veggie patty with fresh toppings on a toasted bun.',
    category: 'Veggie',
    price: '9.85',
    image:
      'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=720&q=85',
    is_available: true,
  },
  {
    id: 'veggie-double',
    name: 'Veggie Double',
    description: 'Two veggie patties with fresh toppings on a toasted bun.',
    category: 'Veggie',
    price: '10.29',
    image:
      'https://vanillaandbean.com/wp-content/uploads/2025/07/BlackBeanVeggieBurger-1-680x453.jpg',
    is_available: true,
  },
  {
    id: 'mushroom-swiss',
    name: 'Mushroom Swiss',
    description: 'Sauteed mushrooms and Swiss cheese on a veggie burger.',
    category: 'Veggie',
    price: '11.99',
    image:
      'https://images.unsplash.com/photo-1683882330182-eb8f64d7231c?auto=format&fit=crop&w=720&q=85',
    is_available: true,
  },
  {
    id: 'eggplant-parm',
    name: 'Eggplant Parm',
    description: 'Breaded eggplant with tomato sauce and melted cheese.',
    category: 'Veggie',
    price: '11.49',
    image:
      'https://themodernnonna.com/wp-content/uploads/2026/05/IMG_4766-scaled.jpg',
    is_available: true,
  },
  {
    id: 'fries-small',
    name: 'Fries: Small',
    description: 'A small serving of crisp, golden fries.',
    category: 'Sides',
    price: '2.59',
    image:
      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=720&q=85',
    is_available: true,
  },
  {
    id: 'fries-medium',
    name: 'Fries: Medium',
    description: 'A medium serving of crisp, golden fries.',
    category: 'Sides',
    price: '3.99',
    image:
      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=720&q=85',
    is_available: true,
  },
  {
    id: 'fries-large',
    name: 'Fries: Large',
    description: 'A large serving of crisp, golden fries.',
    category: 'Sides',
    price: '4.79',
    image:
      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=720&q=85',
    is_available: true,
  },
  {
    id: 'iced-coffee',
    name: 'Iced Coffee',
    description: 'Chilled coffee served over ice.',
    category: 'Drinks',
    price: '2.79',
    image:
      'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=720&q=85',
    is_available: true,
  },
  {
    id: 'hot-coffee',
    name: 'Hot Coffee',
    description: 'Freshly brewed hot coffee.',
    category: 'Drinks',
    price: '2.19',
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=720&q=85',
    is_available: true,
  },
  {
    id: 'tea',
    name: 'Tea',
    description: 'A freshly brewed cup of hot tea.',
    category: 'Drinks',
    price: '2.19',
    image:
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=720&q=85',
    is_available: true,
  },
  {
    id: 'hot-chocolate',
    name: 'Hot Chocolate',
    description: 'Warm, rich hot chocolate.',
    category: 'Drinks',
    price: '2.19',
    image:
      'https://images.unsplash.com/photo-1517578239113-b03992dcdd25?auto=format&fit=crop&w=720&q=85',
    is_available: true,
  },
  {
    id: 'soda',
    name: 'Soda',
    description: 'A refreshing cold soda.',
    category: 'Drinks',
    price: '1.69',
    image:
      'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=720&q=85',
    is_available: true,
  },
];

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Burgers');
  const [addedItems, setAddedItems] = useState<string[]>([]);
  const [serverItems, setServerItems] = useState<MenuItem[]>(menuItems);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);

  useEffect(() => {
    async function loadMenuItems() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/menu/');

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result: { items: ApiMenuItem[] } = await response.json();

        const mergedItems = [
          ...result.items.map((apiItem) => {
            const sample = menuItems.find(
              (item) => item.name === apiItem.name,
            );
            return {
              ...(sample ?? {}),
              id: String(apiItem.id),
              name: apiItem.name,
              description: apiItem.description || sample?.description || '',
              category: apiItem.category,
              price: apiItem.price,
              image: apiItem.image || sample?.image || '',
              is_available: apiItem.is_available,
              allergens: apiItem.allergens,
              ingredients: apiItem.ingredients,
            };
          }),
        ];

        setServerItems(mergedItems);
      } catch (error) {
        console.warn('Could not load Django menu; using sample menu. ', error);
      }
    }

    void loadMenuItems();
  }, []);

  const visibleItems = serverItems.filter(
    (item) => item.category === selectedCategory,
  );

  const getAllergenWarnings = (item: MenuItem) => {
    if (item.allergens == null) {
      return [];
    }

    return selectedAllergens.filter((allergen) =>
      item.allergens?.includes(allergen),
  );
};

  function addItem(itemId: string) {
    setAddedItems((currentItems) =>
      currentItems.includes(itemId) ? currentItems : [...currentItems, itemId],
    );
  }

  function toggleAllergen(allergenId: string) {
    setSelectedAllergens((currentAllergens) =>
      currentAllergens.includes(allergenId)
        ? currentAllergens.filter((selectedId) => selectedId !== allergenId)
        : [...currentAllergens, allergenId],
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

        <View style={styles.allergenPanel}>
          <View style={styles.allergenHeader}>
            <Text style={styles.allergenHeading}>Allergen preferences</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear selected allergens"
              disabled={selectedAllergens.length === 0}
              onPress={() => setSelectedAllergens([])}
              style={({ pressed }) => [
                styles.clearAllergensButton,
                selectedAllergens.length === 0 && styles.clearAllergensButtonDisabled,
                pressed && styles.buttonPressed,
              ]}>
              <Text
                style={[
                  styles.clearAllergensText,
                  selectedAllergens.length === 0 && styles.clearAllergensTextDisabled,
                ]}>
                Clear Filters
              </Text>
            </Pressable>
          </View>
          <View style={styles.allergenOptions}>
            {allergenOptions.map((allergen) => {
              const isSelected = selectedAllergens.includes(allergen.id);
              return (
                <Pressable
                  key={allergen.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => toggleAllergen(allergen.id)}
                  style={[
                    styles.allergenOption,
                    isSelected && styles.allergenOptionSelected,
                  ]}>
                  <Text
                    style={[
                      styles.allergenOptionText,
                      isSelected && styles.allergenOptionTextSelected,
                    ]}>
                    {allergen.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.allergenDisclaimer}>
                Allergen information may not include cross-contact. If you have a
                severe allergy, please ask a staff member before ordering.
              </Text>
        </View>

        <View style={styles.menuHeadingRow}>
          <Text style={styles.sectionHeading}>{selectedCategory}</Text>
          <Text style={styles.itemCount}>{visibleItems.length} favorites</Text>
        </View>

        <View style={styles.itemList}>
          {visibleItems.map((item) => {
            const isAdded = addedItems.includes(item.id);
            const isUnavailable = item.is_available === false;
            const allergenWarnings = getAllergenWarnings(item);
            const hasUnverifiedAllergens = item.allergens == null;
            return (
              <View key={item.id} style={styles.itemCard}>
                <Image source={{ uri: item.image }} style={styles.itemImage} contentFit="cover" />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>

                  {item.ingredients && item.ingredients.length > 0 && (
                    <Text style={styles.itemIngredients}>
                      Ingredients: {item.ingredients.join(', ')}
                    </Text>
                  )}

                  {hasUnverifiedAllergens ? (
                    <Text style={styles.allergenWarning}>
                      Allergen information not verified
                    </Text>
                  ) : allergenWarnings.length > 0 ? (
                    <Text style={styles.allergenWarning}>
                      Contains selected allergens: {allergenWarnings.join(', ')}
                    </Text>
                  ) : null}
                  <Text style={styles.itemPrice}>${Number(item.price).toFixed(2)}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                      isUnavailable
                        ? `${item.name} unavailable`
                        : `${isAdded ? 'Added' : 'Add'} ${item.name}`
                    }
                    disabled={isUnavailable}
                    onPress={() => addItem(item.id)}
                    style={({ pressed }) => [
                      styles.addButton,
                      isAdded && styles.addButtonAdded,
                      isUnavailable && styles.addButtonUnavailable,
                      pressed && styles.buttonPressed,
                    ]}>
                    <Text
                      style={[
                        styles.addButtonText,
                        isAdded && styles.addButtonTextAdded,
                        isUnavailable && styles.addButtonTextUnavailable,
                      ]}>
                      {isUnavailable ? 'Unavailable' : isAdded ? 'Added' : 'Add'}
                      </Text>
                      {!isAdded && !isUnavailable && (
                        <Text style={styles.addButtonPlus}>+</Text>
                      )}
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
  allergenPanel: {
    marginHorizontal: 20,
    marginBottom: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2EAE3',
    borderRadius: 8,
    backgroundColor: '#F7FAF7',
  },
  allergenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  allergenHeading: {
    color: '#193D2A',
    fontSize: 15,
    fontWeight: '700',
  },
  clearAllergensButton: {
    minHeight: 32,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  clearAllergensButtonDisabled: {
    opacity: 0.55,
  },
  clearAllergensText: {
    color: '#1E7745',
    fontSize: 13,
    fontWeight: '700',
  },
  clearAllergensTextDisabled: {
    color: '#7B887E',
  },
  allergenOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergenDisclaimer: {
    color: '#66736A',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
  },
  allergenOption: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DCE5DD',
    backgroundColor: '#FFFFFF',
  },
  allergenOptionSelected: {
    borderColor: '#1E7745',
    backgroundColor: '#1E7745',
  },
  allergenOptionText: {
    color: '#526157',
    fontSize: 13,
    fontWeight: '600',
  },
  allergenOptionTextSelected: {
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
    marginBottom: 5,
  },
  itemIngredients: {
    color: '#526157',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 5,
  },
  allergenWarning: {
    color: '#B45309',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  itemPrice: {
    color: '#1E7745',
    fontSize: 16,
    fontWeight: '700',
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
  addButtonUnavailable: {
    backgroundColor: '#E5E5E5',
  },
  addButtonTextUnavailable: {
    color: '#777777',
  },
});

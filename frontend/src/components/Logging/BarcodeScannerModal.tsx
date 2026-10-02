import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../Common/Modal';
import { BARCODE_CATALOG, lookupBarcode } from '../../services/barcodeService';
import { MealType, FoodItem } from '../../types/nutrition';

export const BarcodeScannerModal: React.FC = () => {
  const { activeModal, setActiveModal, addMealLog } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<FoodItem | null>(BARCODE_CATALOG[0].foodItem);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('SNACK');
  const [quantity, setQuantity] = useState(1.0);

  const isOpen = activeModal === 'barcode_log';

  const handleTestScan = (barcode: string) => {
    const item = lookupBarcode(barcode);
    if (item) {
      setSelectedProduct(item);
    }
  };

  const handleConfirmBarcodeLog = () => {
    if (!selectedProduct) return;

    addMealLog({
      date: new Date().toISOString().split('T')[0],
      mealType: selectedMealType,
      notes: `Barcode Scan: ${selectedProduct.name} (${selectedProduct.brand})`,
      items: [
        {
          foodItemId: selectedProduct.id,
          foodName: selectedProduct.name,
          brand: selectedProduct.brand,
          quantity,
          servingUnit: `${selectedProduct.servingSize}${selectedProduct.servingUnit}`,
          calories: Math.round(selectedProduct.calories * quantity),
          proteinG: Math.round(selectedProduct.proteinG * quantity * 10) / 10,
          carbsG: Math.round(selectedProduct.carbsG * quantity * 10) / 10,
          fatG: Math.round(selectedProduct.fatG * quantity * 10) / 10,
        },
      ],
      totalCalories: Math.round(selectedProduct.calories * quantity),
      totalProteinG: Math.round(selectedProduct.proteinG * quantity * 10) / 10,
      totalCarbsG: Math.round(selectedProduct.carbsG * quantity * 10) / 10,
      totalFatG: Math.round(selectedProduct.fatG * quantity * 10) / 10,
    });
    setActiveModal(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setActiveModal(null)}
      title="UPC / Barcode Scanner"
      subtitle="Point camera at product barcode or select sample sports nutrition item"
      maxWidth="560px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Viewfinder Graphic */}
        <div
          style={{
            height: '140px',
            backgroundColor: 'var(--surface-recessed)',
            border: '2px solid var(--border-focus)',
            borderRadius: '4px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Laser scanning beam line */}
          <div
            style={{
              position: 'absolute',
              width: '80%',
              height: '2px',
              backgroundColor: 'var(--color-coral)',
              boxShadow: '0 0 8px var(--color-coral)',
            }}
          />
          <span className="font-telemetry" style={{ fontSize: '0.75rem', color: 'var(--text-dim)', zIndex: 2 }}>
            [ LASER VIEWFINDER ACTIVE ]
          </span>
        </div>

        {/* Quick test sample barcodes */}
        <div>
          <label className="font-interface" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
            Quick Test Barcode Products:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
            {BARCODE_CATALOG.map((cat) => (
              <button
                key={cat.barcode}
                onClick={() => handleTestScan(cat.barcode)}
                style={{
                  backgroundColor: selectedProduct?.id === cat.foodItem.id ? 'var(--color-sage-dim)' : 'var(--surface-recessed)',
                  border: `1px solid ${selectedProduct?.id === cat.foodItem.id ? 'var(--color-sage)' : 'var(--border-subtle)'}`,
                  color: selectedProduct?.id === cat.foodItem.id ? 'var(--color-sage)' : 'var(--text-chalk)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '3px',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                }}
              >
                <div className="font-interface" style={{ fontWeight: 600 }}>{cat.foodItem.name}</div>
                <div className="font-telemetry" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  UPC: {cat.barcode}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected item breakdown */}
        {selectedProduct && (
          <div
            style={{
              backgroundColor: 'var(--surface-recessed)',
              padding: '0.85rem 1rem',
              borderRadius: '3px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div className="font-interface" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-chalk)' }}>
                {selectedProduct.name}
              </div>
              <div className="font-telemetry" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {selectedProduct.brand} • {selectedProduct.servingSize}{selectedProduct.servingUnit}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'var(--surface-active)',
                  borderRadius: '2px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <button
                  onClick={() => setQuantity((q) => Math.max(0.5, Math.round((q - 0.5) * 10) / 10))}
                  style={{ padding: '0.2rem 0.5rem', color: 'var(--text-muted)' }}
                >
                  -
                </button>
                <span className="font-telemetry" style={{ fontSize: '0.75rem', padding: '0 0.4rem', color: 'var(--text-chalk)' }}>
                  {quantity}x
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.round((q + 0.5) * 10) / 10)}
                  style={{ padding: '0.2rem 0.5rem', color: 'var(--text-muted)' }}
                >
                  +
                </button>
              </div>
              <div className="font-telemetry" style={{ fontSize: '0.875rem', color: 'var(--color-sage)', fontWeight: 700 }}>
                {Math.round(selectedProduct.calories * quantity)} kcal (P: {Math.round(selectedProduct.proteinG * quantity)}g)
              </div>
            </div>
          </div>
        )}

        {/* Slot & Confirm */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="font-interface" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Meal Slot:
            </span>
            <select
              value={selectedMealType}
              onChange={(e) => setSelectedMealType(e.target.value as MealType)}
              style={{
                backgroundColor: 'var(--surface-recessed)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-chalk)',
                padding: '0.35rem 0.5rem',
                borderRadius: '3px',
                fontSize: '0.8125rem',
                outline: 'none',
              }}
            >
              <option value="BREAKFAST">Breakfast</option>
              <option value="LUNCH">Lunch</option>
              <option value="DINNER">Dinner</option>
              <option value="SNACK">Snack</option>
            </select>
          </div>

          <button
            onClick={handleConfirmBarcodeLog}
            className="font-interface"
            style={{
              backgroundColor: 'var(--color-sage)',
              color: 'var(--bg-ground)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              padding: '0.5rem 1.25rem',
              borderRadius: '3px',
            }}
          >
            Log Scanned Product
          </button>
        </div>
      </div>
    </Modal>
  );
};

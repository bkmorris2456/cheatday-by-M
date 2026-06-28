import { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Select, MenuItem, FormControl,
  InputLabel, FormHelperText, FormControlLabel, Checkbox,
  Box, Grid, InputAdornment,
} from '@mui/material'
import { doc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../shared/lib/firebase'
import type { Dessert, DessertCategory } from '../../shared/types'

const CATEGORIES: DessertCategory[] = ['cookies', 'brownies', 'cakes', 'seasonal', 'other']

interface Props {
  open: boolean
  onClose: () => void
  dessert?: Dessert | null
  defaultCategory?: DessertCategory
  onSaved: () => void
}

interface FormState {
  name: string
  price: string
  description: string
  shortDescription: string
  category: string
  inventoryCount: string
  maxPerOrder: string
  isActive: boolean
  isFeatured: boolean
  isLimited: boolean
  isSoldOut: boolean
  allergens: string
  dietaryTags: string
}

function emptyForm(category = ''): FormState {
  return {
    name: '',
    price: '',
    description: '',
    shortDescription: '',
    category,
    inventoryCount: '',
    maxPerOrder: '',
    isActive: true,
    isFeatured: false,
    isLimited: false,
    isSoldOut: false,
    allergens: '',
    dietaryTags: '',
  }
}

export default function DessertFormModal({ open, onClose, dessert, defaultCategory, onSaved }: Props) {
  const [form, setForm] = useState<FormState>(emptyForm(defaultCategory))
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (dessert) {
      setForm({
        name: dessert.name,
        price: (dessert.price / 100).toFixed(2),
        description: dessert.description,
        shortDescription: dessert.shortDescription,
        category: dessert.category,
        inventoryCount: String(dessert.inventoryCount),
        maxPerOrder: dessert.maxPerOrder != null ? String(dessert.maxPerOrder) : '',
        isActive: dessert.isActive,
        isFeatured: dessert.isFeatured,
        isLimited: dessert.isLimited,
        isSoldOut: dessert.isSoldOut,
        allergens: dessert.allergens.join(', '),
        dietaryTags: dessert.dietaryTags.join(', '),
      })
    } else {
      setForm(emptyForm(defaultCategory))
    }
    setErrors({})
  }, [open, dessert, defaultCategory])

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.price.trim() || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Must be a positive number'
    if (!form.description.trim()) e.description = 'Required'
    if (!form.shortDescription.trim()) e.shortDescription = 'Required'
    if (!form.category) e.category = 'Required'
    if (form.inventoryCount.trim() === '' || isNaN(Number(form.inventoryCount)) || Number(form.inventoryCount) < 0)
      e.inventoryCount = 'Must be 0 or more'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    try {
      const data = {
        name: form.name.trim(),
        slug: form.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        description: form.description.trim(),
        shortDescription: form.shortDescription.trim(),
        price: Math.round(Number(form.price) * 100),
        category: form.category as DessertCategory,
        inventoryCount: Number(form.inventoryCount),
        maxPerOrder: form.maxPerOrder ? Number(form.maxPerOrder) : null,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        isLimited: form.isLimited,
        isSoldOut: form.isSoldOut,
        allergens: form.allergens ? form.allergens.split(',').map(s => s.trim()).filter(Boolean) : [],
        dietaryTags: form.dietaryTags ? form.dietaryTags.split(',').map(s => s.trim()).filter(Boolean) : [],
        imageUrls: dessert?.imageUrls ?? [],
        availableFrom: dessert?.availableFrom ?? null,
        availableUntil: dessert?.availableUntil ?? null,
        updatedAt: serverTimestamp(),
      }
      if (dessert) {
        await updateDoc(doc(db, 'desserts', dessert.id), data)
      } else {
        await addDoc(collection(db, 'desserts'), { ...data, createdAt: serverTimestamp() })
      }
      onSaved()
      onClose()
    } catch (err) {
      console.error('Error saving dessert:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle>{dessert ? 'Edit Dessert' : 'Add Dessert'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 0.5 }}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth required error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Select
                value={form.category}
                label="Category"
                onChange={e => set('category', e.target.value)}
              >
                {CATEGORIES.map(c => (
                  <MenuItem key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Price"
              value={form.price}
              onChange={e => set('price', e.target.value)}
              error={!!errors.price}
              helperText={errors.price}
              fullWidth
              required
              slotProps={{
                input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Inventory Count"
              type="number"
              value={form.inventoryCount}
              onChange={e => set('inventoryCount', e.target.value)}
              error={!!errors.inventoryCount}
              helperText={errors.inventoryCount}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Max Per Order"
              type="number"
              value={form.maxPerOrder}
              onChange={e => set('maxPerOrder', e.target.value)}
              fullWidth
              helperText="Leave blank for no limit"
            />
          </Grid>

          <Grid size={12}>
            <TextField
              label="Short Description"
              value={form.shortDescription}
              onChange={e => set('shortDescription', e.target.value)}
              error={!!errors.shortDescription}
              helperText={errors.shortDescription}
              fullWidth
              required
            />
          </Grid>
          <Grid size={12}>
            <TextField
              label="Description"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              fullWidth
              required
              multiline
              rows={3}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Allergens"
              value={form.allergens}
              onChange={e => set('allergens', e.target.value)}
              fullWidth
              helperText="Comma-separated (e.g. nuts, dairy)"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Dietary Tags"
              value={form.dietaryTags}
              onChange={e => set('dietaryTags', e.target.value)}
              fullWidth
              helperText="Comma-separated (e.g. vegan, gluten-free)"
            />
          </Grid>

          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <FormControlLabel
                control={<Checkbox checked={form.isActive} onChange={e => set('isActive', e.target.checked)} />}
                label="Active"
              />
              <FormControlLabel
                control={<Checkbox checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} />}
                label="Featured"
              />
              <FormControlLabel
                control={<Checkbox checked={form.isLimited} onChange={e => set('isLimited', e.target.checked)} />}
                label="Limited"
              />
              <FormControlLabel
                control={<Checkbox checked={form.isSoldOut} onChange={e => set('isSoldOut', e.target.checked)} />}
                label="Sold Out"
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

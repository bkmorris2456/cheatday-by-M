import { useState, useEffect, useCallback } from 'react'
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, Chip,
  IconButton, CircularProgress,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../../shared/lib/firebase'
import type { Dessert, DessertCategory } from '../../shared/types'
import DessertFormModal from './DessertFormModal'

const CATEGORIES: DessertCategory[] = ['cookies', 'brownies', 'cakes', 'seasonal', 'other']
const ROWS_PER_PAGE = 10

export default function DessertManagementSection() {
  const [desserts, setDesserts] = useState<Dessert[]>([])
  const [loading, setLoading] = useState(true)
  const [pages, setPages] = useState<Record<string, number>>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDessert, setSelectedDessert] = useState<Dessert | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<DessertCategory>('cookies')

  const fetchDesserts = useCallback(async () => {
    setLoading(true)
    try {
      const snap = await getDocs(query(collection(db, 'desserts'), orderBy('name')))
      setDesserts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Dessert)))
    } catch (err) {
      console.error('Error fetching desserts:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchDesserts() }, [fetchDesserts])

  function openAdd(category: DessertCategory) {
    setSelectedDessert(null)
    setSelectedCategory(category)
    setModalOpen(true)
  }

  function openEdit(dessert: Dessert) {
    setSelectedDessert(dessert)
    setSelectedCategory(dessert.category)
    setModalOpen(true)
  }

  function getPage(category: string) {
    return pages[category] ?? 0
  }

  function setPage(category: string, page: number) {
    setPages(prev => ({ ...prev, [category]: page }))
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Dessert Management</Typography>

      {CATEGORIES.map(category => {
        const items = desserts.filter(d => d.category === category)
        const page = getPage(category)
        const paginated = items.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE)

        return (
          <Paper key={category} sx={{ mb: 3, overflow: 'hidden' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 3,
                py: 2,
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6" sx={{ textTransform: 'capitalize', fontWeight: 600 }}>
                {category}
              </Typography>
              <Button
                size="small"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => openAdd(category)}
              >
                Add
              </Button>
            </Box>

            {items.length === 0 ? (
              <Box sx={{ px: 3, py: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  No desserts in this category.
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell width={48} />
                        <TableCell>Name</TableCell>
                        <TableCell>Short Description</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Active</TableCell>
                        <TableCell>Sold Out</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginated.map(dessert => (
                        <TableRow key={dessert.id} hover>
                          <TableCell>
                            <IconButton size="small" onClick={() => openEdit(dessert)} aria-label="edit">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                          <TableCell>{dessert.name}</TableCell>
                          <TableCell
                            sx={{
                              maxWidth: 280,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {dessert.shortDescription}
                          </TableCell>
                          <TableCell>${(dessert.price / 100).toFixed(2)}</TableCell>
                          <TableCell>
                            <Chip
                              label={dessert.isActive ? 'Yes' : 'No'}
                              size="small"
                              color={dessert.isActive ? 'success' : 'default'}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={dessert.isSoldOut ? 'Yes' : 'No'}
                              size="small"
                              color={dessert.isSoldOut ? 'error' : 'default'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {items.length > ROWS_PER_PAGE && (
                  <TablePagination
                    component="div"
                    count={items.length}
                    rowsPerPage={ROWS_PER_PAGE}
                    rowsPerPageOptions={[ROWS_PER_PAGE]}
                    page={page}
                    onPageChange={(_, p) => setPage(category, p)}
                  />
                )}
              </>
            )}
          </Paper>
        )
      })}

      <DessertFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        dessert={selectedDessert}
        defaultCategory={selectedCategory}
        onSaved={fetchDesserts}
      />
    </Box>
  )
}

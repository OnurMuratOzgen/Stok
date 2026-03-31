import Badge from '@/components/ui/Badge'

export default function MovementBadge({ type }: { type: 'in' | 'out' }) {
  return type === 'in' ? (
    <Badge variant="success">Giris</Badge>
  ) : (
    <Badge variant="danger">Cikis</Badge>
  )
}

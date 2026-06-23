type SidebarProps = {
  items: string[]
  activeItem: string
  onSelect: (item: string) => void
}

export default function Sidebar({ items, activeItem, onSelect }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">Menu</div>
      <nav>
        <ul>
          {items.map((item) => (
            <li key={item}>
              <button
                type="button"
                className={item === activeItem ? 'nav-button active' : 'nav-button'}
                onClick={() => onSelect(item)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

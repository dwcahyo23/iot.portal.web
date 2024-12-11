import { Group, Menu, Text, Title, UnstyledButton } from '@mantine/core'
import { ColorSchemeToggle } from '@renderer/components/ColorSchemeToggle/ColorSchemeToggle'
import AuthorityCheck from '@renderer/route/AuthorityCheck'
import { RootState, selectNavigationPortal } from '@renderer/store'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import classes from './HeaderBar.module.css'

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const navigate = useNavigate()
  const location = useLocation()
  const [active, setActive] = useState('')

  // Access navigation data from portalSlice
  const navigation = useSelector((state: RootState) => selectNavigationPortal(state))

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Handle active link styling
  useEffect(() => {
    const currentPath = location.pathname.split('/')[1]
    setActive(currentPath)
  }, [location.pathname])

  // Render navigation links in a dropdown menu
  const links = (
    <Menu position="top-start" withArrow>
      <Menu.Target>
        <UnstyledButton>Menu</UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        {navigation.map((item) => (
          <AuthorityCheck
            key={item.key}
            userAuthority={['user', 'admin']}
            authority={item.authority}
          >
            <Menu.Item
              className={classes.link}
              data-active={item.path.split('/')[1] === active ? 'true' : undefined}
              onClick={() => {
                setActive(item.path)
                navigate(item.path)
              }}
            >
              {item.title}
            </Menu.Item>
          </AuthorityCheck>
        ))}
      </Menu.Dropdown>
    </Menu>
  )

  return (
    <div className={classes.header}>
      <div className={classes.titleLinksContainer}>
        <Title order={2}>IOT APP</Title>
        <div className={classes.links}>{links}</div>
      </div>
      <Group gap="md" className={classes.timeGroup}>
        <ColorSchemeToggle />
        <Text>{currentTime.toLocaleTimeString()}</Text>
      </Group>
    </div>
  )
}

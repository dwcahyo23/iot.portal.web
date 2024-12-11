import { AppShell, Center, Stack, Tooltip, rem } from '@mantine/core'
import CollapsedSideBarUserPopOver from '@renderer/components/UserPopOver/CollapsedSideBarUserPopOver'
import navigationConfig from '@renderer/configs/navigation.config'
import MantineLogo from '@renderer/favicon.svg'
import AuthorityCheck from '@renderer/route/AuthorityCheck'
import { useAppSelector } from '@renderer/store'
import useAuth from '@renderer/utils/hooks/useAuth'
import { IconLogout } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Views from '../Views'
import classes from './CollapsedSideBar.module.css'
import HeaderBar from './HeaderBar'

function CollapsedSideBarBottomContent() {
  const { signOut } = useAuth()
  return (
    <div className={classes.linkWrapper}>
      <div className={classes.link}>
        <CollapsedSideBarUserPopOver />
      </div>
      <div
        className={classes.link}
        onClick={(_event) => {
          signOut()
        }}
      >
        <IconLogout />
      </div>
    </div>
  )
}

function CollapsedSideBarContent() {
  const [active, setActive] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const userAuthority = useAppSelector((state) => state.auth.user.role)

  useEffect(() => {
    const currentPath = location.pathname.split('/')[1]
    setActive(currentPath)
  }, [location.pathname])

  const links = navigationConfig.map((item, index) => (
    <AuthorityCheck
      key={index}
      userAuthority={userAuthority ? userAuthority : []}
      authority={item.authority}
    >
      <Tooltip label={item.title} position="right" withArrow>
        <Link
          className={classes.link}
          data-active={item.path.split('/')[1] === active ? 'true' : undefined}
          to={item.path}
          key={item.title}
          onClick={(event) => {
            event.preventDefault()
            setActive(item.path)
            navigate(item.path)
          }}
        >
          <item.icon className={classes.linkIcon} stroke={1.5} />
        </Link>
      </Tooltip>
    </AuthorityCheck>
  ))

  return (
    <nav className={classes.navbar}>
      <Center>
        <img className={classes.logo} alt={'Mantine Logo'} src={MantineLogo} />
      </Center>
      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <CollapsedSideBarBottomContent />
    </nav>
  )
}

export default function CollapsedSideBar() {
  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: `calc(${rem(80)})`, breakpoint: 'xs' }}
        padding="md"
      >
        <AppShell.Header>
          <HeaderBar />
        </AppShell.Header>
        <AppShell.Navbar>
          <CollapsedSideBarContent />
        </AppShell.Navbar>
        <AppShell.Main>
          <Views />
        </AppShell.Main>
      </AppShell>
      {/* <div
        style={{
          display: 'flex',
          flex: ' 1 1 auto',
          backgroundColor: 'rgb(241,240,240)',
          height: '100vh', // Ensure full height of the viewport
          width: '100vw', // Ensure full width of the viewport
          overflow: 'hidden' // Prevent overflow
        }}
      >
        <CollapsedSideBarContent />
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'rgb(241,240,240)',
            flex: 1,
            overflowY: 'auto' // Allows content to scroll if it overflows
          }}
        >
          <HeaderBar />
          <Views />
        </div>
      </div> */}
    </>
  )
}

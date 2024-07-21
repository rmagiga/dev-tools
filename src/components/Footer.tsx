import { Box, Link, Typography } from '@mui/material'

function Copyright(props: any) {
  return (
    <Typography variant='body2' color="text.secondary" align='center' {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://pgcodetutor.com/">アール</Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

function Footer() {
  return (
    <Box component="footer">
      <Copyright sx={{pt:4}} />
    </Box>
  )
}

export default Footer
import { createGlobalStyle } from 'styled-components'

// Styled Components GLOBAL STYLES
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.6;
  }

  h1,h2,h3,h4,h5,h6 {
    font-family: ${({ theme }) => theme.fonts.body};
    font-weight: 700;
    line-height: 1.25;
    color: ${({ theme }) => theme.colors.dark};
  }

  a { text-decoration: none; color: inherit; }

  button { cursor: pointer; border: none; outline: none; background: none; }

  input, select, textarea {
    font-family: ${({ theme }) => theme.fonts.body};
    outline: none;
  }

  ::-webkit-scrollbar        { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track  { background: ${({ theme }) => theme.colors.bg}; }
  ::-webkit-scrollbar-thumb  { background: ${({ theme }) => theme.colors.primary}; border-radius: 3px; }

  ::selection {
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`

export default GlobalStyle
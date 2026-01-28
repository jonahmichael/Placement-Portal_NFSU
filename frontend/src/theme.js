import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  },
  colors: {
    brand: {
      50: '#f7f7f7',
      100: '#e3e3e3',
      200: '#c8c8c8',
      300: '#a4a4a4',
      400: '#818181',
      500: '#666666',
      600: '#515151',
      700: '#434343',
      800: '#383838',
      900: '#000000',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'white',
        color: 'black',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'normal',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'black',
          color: 'white',
          _hover: {
            bg: 'gray.800',
          },
        },
        outline: {
          borderColor: 'black',
          color: 'black',
          _hover: {
            bg: 'gray.50',
          },
        },
        ghost: {
          _hover: {
            bg: 'gray.100',
          },
        },
      },
      defaultProps: {
        variant: 'outline',
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderWidth: '1px',
          borderColor: 'gray.200',
          borderRadius: 'md',
          boxShadow: 'none',
        },
      },
    },
    Badge: {
      baseStyle: {
        fontWeight: 'normal',
        textTransform: 'none',
        borderRadius: 'sm',
        px: 2,
        py: 1,
      },
      variants: {
        solid: {
          bg: 'black',
          color: 'white',
        },
        outline: {
          borderWidth: '1px',
          borderColor: 'gray.400',
          color: 'gray.800',
        },
        subtle: {
          bg: 'gray.100',
          color: 'gray.800',
        },
      },
      defaultProps: {
        variant: 'subtle',
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'gray.400',
      },
    },
    Tabs: {
      variants: {
        line: {
          tab: {
            borderBottom: '2px solid',
            borderColor: 'transparent',
            _selected: {
              color: 'black',
              borderColor: 'black',
            },
            _hover: {
              color: 'gray.700',
            },
          },
        },
      },
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export default theme;

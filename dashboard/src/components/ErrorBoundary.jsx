import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });
    // Optionally reload the page
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            padding: 3
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              maxWidth: 600,
              textAlign: 'center'
            }}
          >
            <ErrorOutlineIcon 
              sx={{ 
                fontSize: 80, 
                color: 'error.main',
                marginBottom: 2
              }} 
            />
            <Typography variant="h4" gutterBottom color="error">
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We're sorry for the inconvenience. An unexpected error has occurred.
            </Typography>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                sx={{
                  marginTop: 3,
                  padding: 2,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  textAlign: 'left',
                  overflow: 'auto',
                  maxHeight: 200
                }}
              >
                <Typography variant="caption" component="pre" sx={{ fontSize: '0.75rem' }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </Typography>
              </Box>
            )}

            <Box sx={{ marginTop: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={this.handleReset}
              >
                Reload Page
              </Button>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

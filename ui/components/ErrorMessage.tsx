import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <Box sx={{ mt: 2 }}>
      <Alert severity="error">{message}</Alert>
    </Box>
  );
}

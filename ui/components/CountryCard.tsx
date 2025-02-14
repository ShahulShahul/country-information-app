import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, Card, CardActions, CardContent, CardMedia, Typography, Checkbox, FormControlLabel } from '@mui/material';


interface CountryCardProps {
  name: string;
  flag: string;
  region: string;
  time: string;
  code: string;
  onSelect?: (code: string, selected: boolean) => void;
}


export default function CountryCard({ name, flag, region, time, code, onSelect }: CountryCardProps) {
  const router = useRouter();
  const [selected, setSelected] = useState(false);

  const handleSelection = () => {
    const newSelected = !selected;
    setSelected(newSelected);
    onSelect?.(code, newSelected);
  };

  
  return (
    <Card sx={{ maxWidth: '100%' }}>
      <CardMedia
        sx={{ height: 140 }}
        image={flag}
        title={`${name} flag`}
      />
      <CardContent>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography gutterBottom variant="body1" component="div" sx={{ color: 'text.secondary' }}>
          {region}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Local Time: {time}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button size="small" onClick={() => router.push(`/CountryDetail?code=${code}`)}>
          Learn More
        </Button>
        <FormControlLabel
          control={
            <Checkbox
              checked={selected}
              onChange={handleSelection}
              color="primary"
            />
          }
          label="Compare"
        />
      </CardActions>

    </Card>
  );
}

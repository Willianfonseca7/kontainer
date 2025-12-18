import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { reservationService } from "../lib/reservationService";

// Schrittweiser Flow für Reservierungen (4 Steps: Auswahl, Zeitraum, Kunde, Abschluss)
export function ReservationFlow({ open, onClose, defaultCity, defaultSize }) {
  const [step, setStep] = useState(1);
  const [city, setCity] = useState(defaultCity || "DUS");
  const [size, setSize] = useState(defaultSize || "M");
  const [wantsCamera, setWantsCamera] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [usage, setUsage] = useState("privat");
  const [notes, setNotes] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const cityOptions = ["DUS", "KOL"];
  const sizeOptions = ["S", "M", "L"];

  const canNextStep1 = city && size;
  const canNextStep2 = startDate; // endDate optional
  const canSubmitStep3 = customerName && email && acceptTerms;

  const resetState = () => {
    setStep(1);
    setWantsCamera(false);
    setStartDate("");
    setEndDate("");
    setUsage("privat");
    setNotes("");
    setCustomerName("");
    setEmail("");
    setPhone("");
    setAcceptTerms(false);
    setError("");
    setSuccess(false);
  };

  const handleClose = () => {
    resetState();
    onClose?.();
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await reservationService.create({
        city,
        size,
        wants_camera: wantsCamera,
        start_date: startDate,
        end_date: endDate || null,
        customer_name: customerName,
        email,
        phone,
        status: "new",
        notes,
        usage,
      });
      setSuccess(true);
      setStep(4);
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.message ||
        "Unbekannter Fehler";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <Stack spacing={2}>
      <Typography variant="subtitle1">Schritt 1: Auswahl</Typography>
      <FormControl fullWidth size="small">
        <InputLabel id="city-select-label">Stadt</InputLabel>
        <Select
          labelId="city-select-label"
          label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          {cityOptions.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth size="small">
        <InputLabel id="size-select-label">Größe</InputLabel>
        <Select
          labelId="size-select-label"
          label="Size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        >
          {sizeOptions.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControlLabel
        control={
          <Checkbox
            checked={wantsCamera}
            onChange={(e) => setWantsCamera(e.target.checked)}
          />
        }
        label="24/7 Kamera gewünscht"
      />
    </Stack>
  );

  const renderStep2 = () => (
    <Stack spacing={2}>
      <Typography variant="subtitle1">Schritt 2: Zeitraum</Typography>
      <TextField
        label="Startdatum"
        type="date"
        size="small"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        required
      />
      <TextField
        label="Enddatum (optional)"
        type="date"
        size="small"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <FormControl fullWidth size="small">
        <InputLabel id="usage-label">Nutzung</InputLabel>
        <Select
          labelId="usage-label"
          label="Usage"
          value={usage}
          onChange={(e) => setUsage(e.target.value)}
        >
          <MenuItem value="privat">Privat</MenuItem>
          <MenuItem value="gewerblich">Gewerblich</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Notizen (optional)"
        multiline
        minRows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </Stack>
  );

  const renderStep3 = () => (
    <Stack spacing={2}>
      <Typography variant="subtitle1">Schritt 3: Kontakt</Typography>
      <TextField
        label="Name"
        size="small"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        required
      />
      <TextField
        label="E-Mail"
        type="email"
        size="small"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        label="Telefon"
        size="small"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
          />
        }
        label="Ich akzeptiere die Bedingungen und den Datenschutz"
      />
    </Stack>
  );

  const renderStep4 = () => (
    <Stack spacing={2}>
      <Typography variant="h6">Anfrage gesendet</Typography>
      <Typography variant="body2" color="text.secondary">
        Anfrage erhalten. Wir melden uns in Kürze.
      </Typography>
      <Box sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
        <Typography variant="subtitle2">Zusammenfassung</Typography>
        <Typography variant="body2">Stadt: {city}</Typography>
        <Typography variant="body2">Größe: {size}</Typography>
        <Typography variant="body2">Kamera: {wantsCamera ? "Ja" : "Nein"}</Typography>
        <Typography variant="body2">Start: {startDate}</Typography>
        <Typography variant="body2">Ende: {endDate || "—"}</Typography>
        <Typography variant="body2">Name: {customerName}</Typography>
        <Typography variant="body2">E-Mail: {email}</Typography>
        {phone ? <Typography variant="body2">Telefon: {phone}</Typography> : null}
        {notes ? <Typography variant="body2">Notizen: {notes}</Typography> : null}
      </Box>
    </Stack>
  );

  const renderContent = useMemo(() => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  }, [step, city, size, wantsCamera, startDate, endDate, usage, notes, customerName, email, phone, acceptTerms, success]);

  const next = () => {
    if (step === 1 && canNextStep1) setStep(2);
    else if (step === 2 && canNextStep2) setStep(3);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Reservieren</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          {error ? <Alert severity="error">{error}</Alert> : null}
          {renderContent}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Close
        </Button>
        {step < 3 && (
          <Button onClick={next} variant="contained" disabled={loading || (step === 1 ? !canNextStep1 : !canNextStep2)}>
            Weiter
          </Button>
        )}
        {step === 3 && (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !canSubmitStep3}
          >
            {loading ? "Wird gesendet..." : "Anfrage senden"}
          </Button>
        )}
        {step === 4 && (
          <Button onClick={handleClose} variant="contained">
            Weitere Container ansehen
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

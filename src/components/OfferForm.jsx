import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { reservationService } from "../lib/reservationService";

// Kurzes Angebotsformular (Lead).
export function OfferForm({ open, onClose, defaultCity, defaultSize }) {
  const [city, setCity] = useState(defaultCity || "");
  const [size, setSize] = useState(defaultSize || "");
  const [wantsCamera, setWantsCamera] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const canSubmit = name && email;

  const handleClose = () => {
    onClose?.();
    setTimeout(() => {
      setSuccess(false);
      setError("");
      setNotes("");
    }, 200);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await reservationService.create({
        city: city || undefined,
        size: size || undefined,
        wants_camera: wantsCamera,
        customer_name: name,
        email,
        phone,
        notes: notes || "Angebotsanfrage",
        status: "new",
      });
      setSuccess(true);
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

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Angebot anfragen</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          {error ? <Alert severity="error">{error}</Alert> : null}
          {success ? (
            <Alert severity="success">
              Anfrage erhalten. Wir melden uns in Kürze.
            </Alert>
          ) : (
            <>
              <TextField
                label="Stadt (optional)"
                size="small"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="DUS / KOL"
              />
              <TextField
                label="Größe (optional)"
                size="small"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="S / M / L"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={wantsCamera}
                    onChange={(e) => setWantsCamera(e.target.checked)}
                  />
                }
                label="Mit Kamera?"
              />
              <TextField
                label="Name"
                size="small"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              <TextField
                label="Nachricht (optional)"
                multiline
                minRows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        {!success && (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !canSubmit}
          >
            {loading ? "Wird gesendet..." : "Senden"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

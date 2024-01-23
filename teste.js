const calculatePayloadLength = (payload) => {
    const payloadLength = payload.length / 2; // Divide por 2, pois cada byte é representado por 2 caracteres hexadecimais
    const payloadLengthHex = payloadLength.toString(16).toUpperCase().padStart(4, '0');
    return Buffer.from(payloadLengthHex, 'hex');
  };
  
  const payload = "021A0101FA6001";
  const payloadLengthBuffer = calculatePayloadLength(payload);
  console.log(payloadLengthBuffer);
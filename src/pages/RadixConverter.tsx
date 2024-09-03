import { ChangeEvent, useState } from "react";
import { Box, Button, Grid, IconButton, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material"
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import BigNumber from "bignumber.js";




function RadixConverter() {
  const [inputRadixType, setInputRadixType] = useState<string>("10");
  const [inputRadixValue, setInputRadixValue] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const [outputRadix, setOutputRadix] = useState<BigNumber|null>(null);

  function handleConvert() {
    BigNumber.DEBUG = true;
    try {
      console.log(inputRadixValue);
      console.log(inputRadixType);
      const bigNumber = new BigNumber(inputRadixValue, parseInt(inputRadixType));
      bigNumber.toString(2);
      bigNumber.toString(8);
      bigNumber.toString(10);
      bigNumber.toString(16);

      setOutputRadix(bigNumber);

      setError(false)
    } catch (e) {
      setError(true);
    }
  }
  function changeInputText(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputRadixValue(value);
  }
  function changeInputType(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputRadixType(value);
  }

  function createData(title: string, value: string) {
    return { title, value };
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  function createRows() {
    return [
      createData("2進数", outputRadix ? outputRadix.toString(2) : ""),
      createData("8進数", outputRadix ? outputRadix.toString(8) : ""),
      createData("10進数", outputRadix ? outputRadix.toString(10) : ""),
      createData("16進数", outputRadix ? outputRadix.toString(16) : ""),
    ]
  }
  
  return (
    <>
      <Box component="h2">基数相互変換ツール</Box>

      <Typography paragraph>
      2進数、8進数、10進数、16進数、を相互変換するツールです。
      </Typography>
      <Grid item xs={12} container sx={{ marginY: 2 }} spacing={1}>
        <Grid item xs={2}>
        <TextField
              select
              InputLabelProps={{ htmlFor: "inputValueType" }}
              InputProps={{ id: "inputValueType" }}
              label="進数"
              fullWidth
              onChange={changeInputType}
              defaultValue={10}
            >
            <MenuItem key="1" value="2">2進数</MenuItem>
            <MenuItem key="2" value="8">8進数</MenuItem>
            <MenuItem key="3" value="10">10進数</MenuItem>
            <MenuItem key="4" value="16">16進数</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={8}>
          <TextField
            id="inputValue"
            label="入力してください"
            fullWidth
            onChange={changeInputText}
            helperText={error ? "日付の解析に失敗しました。" : ""}
            error={error}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
              variant="contained"
              onClick={handleConvert}
              fullWidth
              sx={{ height: "100%", fontSize: 18 }}
            >
              変換
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ marginTop: 5 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              <TableCell sx={{ width: "35%", color: "white" }}>
                日付形式
              </TableCell>
              <TableCell sx={{ width: "65%", color: "white" }}>日時</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {createRows().map((row) => (
              <TableRow
                key={row.title}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="td" scope="row" sx={{ fontSize: 18 }}>
                  {row.title}
                </TableCell>
                <TableCell align="left" sx={{ fontSize: 18 }}>
                  <Tooltip title="Copy to Clipboard" placement="top" arrow>
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => copyToClipboard(row.value)}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {row.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default RadixConverter
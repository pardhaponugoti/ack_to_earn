import { Button, Card, Container } from "@mui/material";
function Balance(props) {
  return (
    <div className="bg-blue-100 h-screen">
      <Container className=" pt-12">
        <Card className="p-6 ">
          <p className="font-bold text-lg py-1">Balances</p>
          <div className="flex py-1">
            <p className="basis-1/2">
              In received messages: <span className="font-medium"> $501</span>
            </p>
            <p className="basis-1/2">
              Available to claim: <span className="font-medium"> $50</span>
            </p>
          </div>
          <div className="flex py-1">
            <p className="basis-1/2">
              In sent messages: <span className="font-medium"> $2</span>
            </p>
            <Button className="basis-1/4" variant="contained">
              Send to wallet
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
}

export default Balance;

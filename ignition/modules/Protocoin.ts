import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ProtocoinModule = buildModule("ProtocoinModule", (m) => { 
  const protocoin = m.contract("Protocoin");

  return { protocoin };
});

export default ProtocoinModule;

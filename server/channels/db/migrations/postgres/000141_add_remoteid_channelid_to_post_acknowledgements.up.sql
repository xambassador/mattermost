ALTER TABLE postacknowledgements ADD COLUMN IF NOT EXISTS remoteid VARCHAR(26) DEFAULT '';
ALTER TABLE postacknowledgements ADD COLUMN IF NOT EXISTS channelid VARCHAR(26) DEFAULT '';
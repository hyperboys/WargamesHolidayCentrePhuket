# Pricing Update - USD 100/THB 3,500 with First/Last Day Surcharge

## Changes Made (January 21, 2026)

### New Pricing Structure

#### Players
- **Regular days**: USD $100 per day (THB ฿3,500)
- **First & Last days**: USD $50 per day (THB ฿1,750)

#### Adult Companions
- **Regular days**: USD $50 per day (THB ฿1,750)
- **First & Last days**: USD $25 per day (THB ฿875)

### Example Calculations

**3D/2N Weekend Warrior (2 nights)**
- 1 Player: 1 × ($50 + $100 + $50) = $200
- 1 Adult Companion: 1 × ($25 + $50 + $25) = $100
- **Total: $300**

**5D/4N Extended Campaign (4 nights)**
- 1 Player: 1 × ($50 + $100 + $100 + $100 + $50) = $400
- 1 Adult Companion: 1 × ($25 + $50 + $50 + $50 + $25) = $200
- **Total: $600**

### Files Modified

1. **script.js** (Lines ~2200-2260)
   - Updated main pricing calculation to implement first/last day surcharge
   - Both THB and USD pricing now include dynamic calculations

2. **script.js** (Lines ~2645-2740)
   - Updated display calculation for price breakdowns
   - Shows detailed breakdown with first/last day surcharges clearly labeled
   - Updated both Thai (TH) and English (EN) language displays

3. **index.html** (Multiple locations)
   - Updated displayed starting prices from $200/฿7,000 to $100/฿3,500
   - Two locations updated:
     - Line ~546: Campaign Weekends package price
     - Line ~1170: Event modal pricing

### Currency Support

✅ **USD (English)**: Displays prices in $, with first/last days marked as $50/$25
✅ **THB (Thai)**: Displays prices in ฿, with first/last days marked as ฿1,750/฿875

### Price Breakdown Display

Both languages now show:
- Package and accommodation details
- Detailed calculation for each guest type
- Clear marking of first/last day surcharges
- Total price with currency formatting

### Notes

- Children's pricing remains flexible (contact for details)
- First/last days automatically calculated based on check-in/check-out dates
- If stay is only 1 night, only the surcharge rate (first/last day) applies
- Prices are in the selected currency (USD or THB based on language)

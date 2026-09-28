# Revision 2: booking, onboarding, rider score, and Arabic RTL

## What will change

- Make the signed-in home screen a two-tab booking experience:
  - **حجز جديد** keeps the existing full booking form and validation.
  - **الرحلات المجتمعية** offers only origin, destination, and date, then opens a filtered results list showing route, time, seats, and join price.
- Keep the existing standalone Community Rides page and bottom-navigation entry, while allowing it to display the home search filters and a clear no-results state.
- Show **وفّر حتى 60%** directly on every car option when the original booking is open to sharing.
- Add a placeholder rider score of **5.0** to each profile and display it clearly on the Profile screen.
- Add a future-ready join-request data shape carrying rider identity and score, without adding accept/reject controls or changing the current instant-join flow.
- Add a four-screen, swipeable Arabic introduction before login on first launch only, with simple illustrations, dots, Skip, Next, and Get Started controls.
- Audit all existing screens for Arabic and RTL: alignment, tab order, arrows and directional icons, route arrows, progress/dots, form controls, messages, empty states, and navigation.
- Keep phone and OTP values internally left-to-right with consistent numerals, while aligning their fields correctly within the Arabic layout.
- Replace the browser-native travel date field with the app’s Arabic calendar control so month names, labels, and direction are consistently Arabic.
- Translate global error and not-found screens. Arabic remains the default; the existing English setting remains available and continues to switch document language/direction.

## Technical details

- Store onboarding completion locally with the existing prototype state, so it appears once per installation/browser profile and does not require a backend.
- Keep Community search criteria separate from the new-booking draft and pass them as validated URL search parameters to `/community`.
- Extend the user model with `riderScore`, migrate older locally saved users to the placeholder score, and define a separate future `JoinRequest` type containing a rider snapshot.
- Use the existing carousel library in RTL mode and the existing semantic color tokens/components; no new backend, payment, SMS, or approval workflow.
- Preserve all current booking, wallet, pricing, trip, return-trip, and simulated login behavior.

## Verification

- Test first launch → skip/start → login → signed-in two-tab booking flow.
- Test a Community search with matching and empty results.
- Test shared-booking car cards, profile score, Arabic calendar, and phone/OTP entry.
- Check all routes at mobile and desktop widths for RTL alignment, mirrored controls, text overflow, and console/runtime errors.

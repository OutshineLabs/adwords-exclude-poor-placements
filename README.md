
# Exclude Poor placements

If you spend a lot of time excluding poor performing placements from your AdWords campaigns this
this script can be used for automating this process.

A blog post on this script [can be found here](http://outshine.ca/blog/2016/7/8/automate-negative-placement-in-google-display-with-this-script).

## How it works

The Adwords script monitors your display placement data and automatically negative matches any URL
with a TLD you don’t want. As soon as a placement from an unwanted TLD shows up, the script adds it
to the negative match list. We recommend running it on an hourly schedule for maximum effectiveness.

It is built to run on either the individual account or MCC level. Using the MCC level makes it easy
and efficient to exclude poor TLDs across all of your accounts.

The only work you need to do is to tell the script which TLDs to add as negative placements. In the
example below, we've excluded all .xyz, .info or .tk domains. But that's only a sliver of the
potential. We recommend reviewing your historical placement data and unearthing the worst domains
by performance.

To exclude more TLDs from your placements, just add them to the list of TLDs starting at line 9.
TLDs should start with a '.' and be comma-delimited.

## Compilation and Installation

This script is written using Typescript. To compile this script run the following :

```bash
> npm install -g typescript
> tcs
```

This will output the compiled script to the `dist/` directory ready to be copied and pasted into
your AdWords account.

For information on how to install AdWords scripts check out BrainLab's introduction blog post to
AdWords scripts here : http://www.brainlabsdigital.com/introduction-to-adwords-scripts/

## Authors

- Dawson Reid (ddaws)

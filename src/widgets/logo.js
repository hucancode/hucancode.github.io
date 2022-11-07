import React from "react";

function Container(props) {
  return (
    <div
      className="flex
        h-full items-center justify-center
        overflow-hidden
        rounded-full
        border-2
        border-white
        bg-gray-800 p-1
        dark:border-blue-200 dark:bg-gray-900"
    >
      {props.children}
    </div>
  );
}

function Icon() {
  return (
    <svg
      className="w-full
        fill-current
        text-white dark:text-blue-300"
      viewBox="0 0 300 175"
    >
      <path d="m 162.39409,150.36157 c -18.90296,-12.62214 -18.90296,-12.62214 -41.42852,-8.94284 -25.72524,4.20192 -24.00063,4.79723 -24.03828,-8.29772 -0.0184,-6.4135 -0.0184,-6.4135 -21.62181,-6.4135 -11.881856,0 -21.596798,-0.4557 -21.58876,-1.01266 0.0081,-0.55696 0.898522,-3.92583 1.978854,-7.48637 2.261629,-7.45384 3.02385,-6.83656 -11.252684,-9.11292 -9.144089,-1.458 -10.218124,-1.37544 -13.502109,1.03805 -15.708245,11.54443 -18.094858,12.99944 -16.53172,10.07869 2.268838,-4.23936 10.311315,-12.01401 14.862428,-14.36748 5.448498,-2.81753 18.160529,-4.58768 24.552165,-3.41889 6.118662,1.11888 8.537304,2.6782 4.15412,2.6782 -3.634088,0 -3.83887,2.22854 -0.307768,3.34927 2.463089,0.78176 2.502109,1.15841 0.660688,6.37756 -1.07635,3.0507 -1.755937,5.74779 -1.510192,5.99354 0.373186,0.37319 34.825978,3.1335 39.575328,3.17073 0.83176,0.007 2.29226,2.89793 3.24556,6.42536 3.15314,11.66737 1.36285,11.14122 23.73172,6.97444 19.86657,-3.70065 19.86657,-3.70065 37.94741,8.40058 9.94447,6.65569 18.94153,12.43152 19.99347,12.83519 1.10737,0.42494 7.35468,-3.56408 14.8386,-9.47475 10.68218,-8.43658 13.56165,-10.08827 16.58796,-9.51498 9.0684,1.7179 33.39128,5.67783 33.61604,5.4729 0.34837,-0.31759 1.53063,-7.80632 1.66487,-10.54559 0.0841,-1.71637 1.93756,-2.49393 7.6444,-3.20695 8.02942,-1.00321 9.79125,-2.7348 7.37541,-7.24884 -1.36286,-2.54654 -1.13325,-2.80593 2.48393,-2.80593 2.19209,0 4.20545,-0.65947 4.47411,-1.46548 0.30726,-0.92173 3.35479,-0.19786 8.21379,1.95102 5.63596,2.49249 7.72529,4.13706 7.72529,6.08078 0,1.46537 0.3951,3.77728 0.87802,5.13759 0.575,1.61976 -0.76655,0.92213 -3.88733,-2.02145 -3.29283,-3.10588 -6.53467,-4.73208 -10.49133,-5.26278 -5.72599,-0.76802 -5.72599,-0.76802 -3.53409,2.57722 1.20553,1.83988 1.78469,3.75244 1.287,4.25013 -0.49767,0.49767 -5.0266,0.90487 -10.06427,0.90487 -9.1594,0 -9.1594,0 -10.04819,7.85591 -0.88879,7.8559 -0.88879,7.8559 -18.669,4.53868 -17.78021,-3.31723 -17.78021,-3.31723 -33.66548,6.99641 -8.73691,5.67251 -16.0116,10.27326 -16.16598,10.22389 -0.15439,-0.0494 -8.78703,-5.76972 -19.18365,-12.71188 z M 223.67,114.83545 c -18.63397,-9.73449 -24.84136,-32.264147 -14.81191,-53.759737 5.99757,-12.85429 14.78706,-18.34633 29.29948,-18.30754 11.75903,0.0314 18.20522,2.15557 23.93746,7.88782 12.62704,12.62703 13.68956,44.6393 1.88634,56.832707 -11.00108,11.36472 -27.02862,14.28574 -40.31137,7.34675 z m 16.98855,-33.060827 c 10.7473,-6.08716 15.54794,-19.1631 11.51822,-31.37325 -1.23308,-3.73627 -2.40216,-4.78269 -6.12322,-5.48077 -6.48393,-1.21639 -17.2296,1.69234 -24.6249,6.66567 -10.24389,6.88901 -17.57065,21.45512 -13.53091,26.9004 4.80569,6.47774 23.76881,8.38093 32.76081,3.28795 z m -68.81299,27.506017 c -4.73832,-0.73793 -5.0017,-0.95428 -2.14703,-1.76374 1.93331,-0.54819 4.6731,-0.15103 6.75105,0.97866 3.75149,2.03951 3.6079,2.064 -4.60402,0.78508 z M 90.034651,105.98506 C 74.5575,99.618123 63.684828,88.715693 60.285484,76.154493 c -3.307674,-12.22248 0.784335,-30.51443 8.851729,-39.56871 10.484761,-11.76735 30.876497,-15.35165 45.163297,-7.93845 9.68268,5.02421 19.01388,14.5976 23.87131,24.49091 3.46981,7.0671 3.96185,9.52776 3.91148,19.56083 -0.0674,13.43256 -1.59775,17.07907 -10.68131,25.45201 -12.18098,11.228037 -26.51722,13.942967 -41.367339,7.833977 z M 134.53123,69.919783 c 3.97829,-2.4254 4.44077,-3.27629 3.72527,-6.85379 -1.45671,-7.28358 -5.27507,-13.64055 -12.41247,-20.66481 -7.29524,-7.17961 -21.85471,-15.64485 -26.76196,-15.56008 -3.61225,0.0624 -9.938079,8.26136 -11.083108,14.36489 -1.95439,10.41779 5.770498,24.182 16.240538,28.93739 7.96398,3.61716 24.18832,3.49739 30.29173,-0.2236 z m 40.4367,31.561587 c 0.97467,-0.39004 2.13923,-0.34208 2.58791,0.10653 0.44866,0.44866 -0.34882,0.76778 -1.77216,0.70916 -1.57292,-0.0648 -1.89286,-0.38473 -0.81575,-0.81575 z m 25.15291,-55.042717 c -2.12439,-3.24224 -2.00827,-3.56862 4.08854,-11.49188 5.73452,-7.45244 6.7189,-8.15487 11.42818,-8.15487 2.83423,0 7.14636,-0.39865 9.5825,-0.88588 5.96273,-1.19254 5.09989,-0.091 -10.13877,12.94341 -12.77395,10.92622 -12.77395,10.92622 -14.96045,7.58922 z m -67.46557,-19.14621 c -5.8181,-7.330154 -11.8361,-14.744087 -13.37335,-16.475414 -2.79501,-3.147864 -2.79501,-3.147864 0.58052,-2.423494 1.85654,0.398404 7.70458,1.401322 12.99562,2.228707 9.62011,1.504335 9.62011,1.504335 12.49373,11.199861 3.44601,11.62669 3.44463,11.56425 0.34344,15.59692 -2.46159,3.20096 -2.46159,3.20096 -13.03996,-10.12658 z" />
    </svg>
  );
}

export default function Logo() {
  return (
    <Container>
      <Icon />
    </Container>
  );
}

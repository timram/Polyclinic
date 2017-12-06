async function main() {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('async operation'); resolve(true);
    }, 2000);
  });

  await promise;

  console.log('END');
}

main();
